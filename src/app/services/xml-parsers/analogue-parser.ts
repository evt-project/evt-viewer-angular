import { AppConfig } from 'src/app/app.config';
import { xmlParser } from '.';
import { ParallelPassage, XMLElement } from '../../models/evt-models';
import { getOuterHTML } from '../../utils/dom-utils';
import { AttributeParser, BibliographyListParser, BibliographyParser, EmptyParser } from './basic-parsers';
import { createParser, getID, parseChildren, Parser } from './parser-models';
import { chainFirstChildTexts, getExternalSources } from 'src/app/utils/xml-utils';

@xmlParser('evt-analogue-entry-parser', AnalogueParser)
export class AnalogueParser extends EmptyParser implements Parser<XMLElement> {

    attributeParser = createParser(AttributeParser, this.genericParse);
    biblParser = createParser(BibliographyParser, this.genericParse);
    listBiblParser = createParser(BibliographyListParser, this.genericParse);

    biblAttributeToMatch = AppConfig.evtSettings.edition.externalBibliography.biblAttributeToMatch;
    elementAttributesToMatch = AppConfig.evtSettings.edition.externalBibliography.elementAttributesToMatch;

    public parse(analogue: XMLElement): ParallelPassage {
        return {
            type: ParallelPassage,
            id: getID(analogue),
            attributes: this.attributeParser.parse(analogue),
            text: chainFirstChildTexts(analogue),
            content: parseChildren(analogue, this.genericParse),
            attrTarget: analogue.getAttribute('target'),
            attrSource: analogue.getAttribute('source'),
            sources: this.getSources(analogue),
            extSources: getExternalSources(analogue, this.elementAttributesToMatch, this.biblAttributeToMatch).map((x) => this.biblParser.parse(x)),
            class: analogue.tagName.toLowerCase(),
            originalEncoding: getOuterHTML(analogue),
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

}
