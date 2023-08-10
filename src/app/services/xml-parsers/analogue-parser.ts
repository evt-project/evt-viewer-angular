import { xmlParser } from '.';
import { BibliographicEntry, ParallelPassage, XMLElement } from '../../models/evt-models';
import { getOuterHTML } from '../../utils/dom-utils';
import { AttributeParser, BibliographyListParser, BibliographyParser, EmptyParser } from './basic-parsers';
import { createParser, getID, parseChildren, Parser } from './parser-models';
import { chainFirstChildTexts } from 'src/app/utils/xml-utils';

@xmlParser('evt-analogue-entry-parser', AnalogueParser)
export class AnalogueParser extends EmptyParser implements Parser<XMLElement> {

    attributeParser = createParser(AttributeParser, this.genericParse);
    biblParser = createParser(BibliographyParser, this.genericParse);
    listBiblParser = createParser(BibliographyListParser, this.genericParse);

    public parse(analogueEntry: XMLElement): ParallelPassage {
        return {
            type: ParallelPassage,
            id: getID(analogueEntry),
            attributes: this.attributeParser.parse(analogueEntry),
            text: chainFirstChildTexts(analogueEntry),
            content: parseChildren(analogueEntry, this.genericParse),
            attrTarget: analogueEntry.getAttribute('target'),
            attrSource: analogueEntry.getAttribute('source'),
            sources: this.getSources(analogueEntry),
            extSources: this.getExternalSources(analogueEntry),
            class: analogueEntry.tagName.toLowerCase(),
            originalEncoding: getOuterHTML(analogueEntry),
        };
    }

    /**
     * Retrieve all Bibliography elements inside this analogue element
     * if referred with the proper attribute.
     * @param quote XMLElement
     * @returns array of Bibliography Element or a single Bibliography List element
     */
    private getSources(analogue: XMLElement): any {
        const bibl = ['bibl'];
        const biblList = ['listBibl'];

        return Array.from(analogue.children)
            .map((x: XMLElement) => bibl.includes(x['tagName']) ? this.biblParser.parse(x) : (
                biblList.includes(x['tagName']) ? this.listBiblParser.parse(x) : null))
            .filter((x) => x);
    }

    /**
     * Retrieve external bibliography element outside the analogue element
     * This first solution is brutal: it searches all document for a bibl with the correct xml:id
     * it would be faster if we knew the id or unique element to search in
     * @param analogue XMLElement
     * @returns array of Bibliography Element
     */
    private getExternalSources(analogue: XMLElement): BibliographicEntry[] {
        const sourcesToFind = [analogue.getAttribute('target'), analogue.getAttribute('source')]
            .filter((x) => x)
            .map((x) => x.replace('#',''));
        const sourcesFound = Array.from(analogue.ownerDocument.querySelectorAll<XMLElement>('bibl'))
            .filter((x) => sourcesToFind.includes(x.getAttribute('xml:id')))
            .map((x) => this.biblParser.parse(x));

        return sourcesFound;
    }

}
