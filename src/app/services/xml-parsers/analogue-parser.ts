import { AppConfig } from 'src/app/app.config';
import { parse, xmlParser } from '.';
import { AnalogueClass, BibliographicEntry, GenericElement, ParallelPassage, XMLElement } from '../../models/evt-models';
import { getOuterHTML } from '../../utils/dom-utils';
import { AttributeParser, EmptyParser, GenericElemParser } from './basic-parsers';
import { createParser, getID, parseChildren, Parser } from './parser-models';
import { chainFirstChildTexts, getExternalSources } from 'src/app/utils/xml-utils';
import { BibliographyListParser, BibliographyParser } from './bilbliography-parsers';

@xmlParser('evt-analogue-entry-parser', AnalogueParser)
export class AnalogueParser extends EmptyParser implements Parser<XMLElement> {

    attributeParser = createParser(AttributeParser, this.genericParse);
    biblParser = createParser(BibliographyParser, this.genericParse);
    listBiblParser = createParser(BibliographyListParser, this.genericParse);

    analogueMarker = AppConfig.evtSettings.edition.analogueMarkers;
    biblAttributeToMatch = AppConfig.evtSettings.edition.externalBibliography.biblAttributeToMatch;
    elemAttributesToMatch = AppConfig.evtSettings.edition.externalBibliography.elementAttributesToMatch;

    public parse(analogue: XMLElement): GenericElement|ParallelPassage {

        const sources = this.isAnaloguePassage(analogue);
        const insideCitElement = (analogue.parentElement.tagName === 'cit');
        if ((!sources) || (insideCitElement)) {
            // no sources not a parallel passage, inside a cit element not a parallel passage
            const elementParser = createParser(GenericElemParser, parse);

            return elementParser.parse(analogue)
        }

        return {
            type: ParallelPassage,
            id: getID(analogue),
            class: AnalogueClass,
            attributes: this.attributeParser.parse(analogue),
            text: chainFirstChildTexts(analogue),
            content: parseChildren(analogue, this.genericParse),
            sources: sources.sources,
            extSources: sources.extSources,
            quotedText: this.getQuotedTextFromSources(sources.sources.concat(sources.extSources)),
            originalEncoding: getOuterHTML(analogue),
        };
    }

    /**
     * Since elements like ref and seg are not only used for parallel passages,
     * this function checks if the provided element contains an external link to a bibl element
     * and returns that elements or a false
     * @param analogue
     * @returns any
     */
    private isAnaloguePassage(analogue: XMLElement): any {

        const sources = this.getSources(analogue);
        const extSources = getExternalSources(analogue, this.elemAttributesToMatch, this.biblAttributeToMatch).map((x) => this.biblParser.parse(x));
        const hasPPAttribute = this.analogueMarker.includes(analogue.getAttribute('type'));

        if ((sources.length === 0 && extSources.length === 0) && (!hasPPAttribute)) {
            return false;
        }

        return { 'sources': sources, 'extSources': extSources };
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

    private getQuotedTextFromSources(nodes: BibliographicEntry[]): string[] {
        const quotesInSources = [];
        nodes.forEach((el: BibliographicEntry) => quotesInSources.push({ id: el.id, quote: el.quotedText }));

        return quotesInSources;
    }


}
