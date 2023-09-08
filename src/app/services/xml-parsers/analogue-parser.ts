import { AppConfig } from 'src/app/app.config';
import { parse, xmlParser } from '.';
import { Analogue, AnalogueClass, BibliographicEntry, BibliographicList, GenericElement, XMLElement } from '../../models/evt-models';
import { getOuterHTML } from '../../utils/dom-utils';
import { AttributeParser, GenericElemParser } from './basic-parsers';
import { createParser, getID, parseChildren, ParseFn, Parser } from './parser-models';
import { chainFirstChildTexts, getExternalElements, normalizeSpaces } from 'src/app/utils/xml-utils';
import { BibliographyParser } from './bilbliography-parsers';

export class BasicParser {
    genericParse: ParseFn;
    constructor(parseFn: ParseFn) { this.genericParse = parseFn; }
}

@xmlParser('evt-analogue-entry-parser', AnalogueParser)
export class AnalogueParser extends BasicParser implements Parser<XMLElement> {

    elementParser = createParser(GenericElemParser, parse);
    attributeParser = createParser(AttributeParser, this.genericParse);
    biblParser = createParser(BibliographyParser, this.genericParse);

    analogueMarker = AppConfig.evtSettings.edition.analogueMarkers;
    biblAttributeToMatch = AppConfig.evtSettings.edition.externalBibliography.biblAttributeToMatch;
    elemAttributesToMatch = AppConfig.evtSettings.edition.externalBibliography.elementAttributesToMatch;

    public parse(analogue: XMLElement): GenericElement|Analogue {

        const sources = this.isAnaloguePassage(analogue);
        const insideCitElement = (analogue.parentElement.tagName === 'cit');
        if ((!sources) || (insideCitElement)) {
            // no sources not a parallel passage, inside a cit element not a parallel passage
            return this.elementParser.parse(analogue)
        }

        return {
            type: Analogue,
            id: getID(analogue),
            class: AnalogueClass,
            attributes: this.attributeParser.parse(analogue),
            text: normalizeSpaces(chainFirstChildTexts(analogue)),
            content: parseChildren(analogue, this.genericParse),
            sources: sources.sources,
            extSources: sources.extSources,
            extLinkedElements: this.getParallelElements(analogue),
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
        const elementsAllowedForSources = 'bibl, cit, note, seg';
        const extSources = getExternalElements(analogue, this.elemAttributesToMatch, this.biblAttributeToMatch, elementsAllowedForSources)
            .map((x) => this.biblParser.parse(x));
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
        const bibl = ['bibl','listBibl'];

        return Array.from(analogue.children)
            .map((x: XMLElement) => bibl.includes(x['tagName']) ? this.biblParser.parse(x) : null)
            .filter((x) => x);
    }

    private getQuotedTextFromSources(nodes: BibliographicEntry[]): string[] {
        let quotesInSources = [];

        nodes.forEach((el: BibliographicEntry|BibliographicList) => {
            if (el.type === BibliographicList) {
                quotesInSources = quotesInSources.concat(this.getQuotedTextFromSources(el['sources']));
            } else {
                if (el['quotedText'] !== null) {
                    quotesInSources.push({ id: el.id, quote: el['quotedText'] });
                }
            };
        });

        return quotesInSources;
    }

    private getParallelElements(analogue: XMLElement): any {
        const elementsAllowedForExternal = 'l, p, div, seg, bibl';
        const extMatched = getExternalElements(analogue, this.elemAttributesToMatch, this.biblAttributeToMatch, elementsAllowedForExternal);
        let simplifiedElements = [];

        simplifiedElements = extMatched.map((x) => this.elementParser.parse(x));

        return simplifiedElements;
    }


}
