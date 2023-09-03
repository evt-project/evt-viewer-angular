import { AppConfig } from 'src/app/app.config';
import { parse, xmlParser } from '.';
import { BibliographicEntry, BibliographicList, BibliographicStructEntry, 
    GenericElement, QuoteEntry, SourceClass, XMLElement } from '../../models/evt-models';
import { AnalogueParser } from './analogue-parser';
import { AttributeParser, GenericElemParser } from './basic-parsers';
import { createParser, getID, parseChildren, ParseFn, Parser } from './parser-models';
import { getOuterHTML } from 'src/app/utils/dom-utils';
import { chainFirstChildTexts, getExternalElements } from 'src/app/utils/xml-utils';
//import { MsDescParser } from './msdesc-parser';
import { BibliographyParser } from './bilbliography-parsers';

export class BasicParser {
    genericParse: ParseFn;
    constructor(parseFn: ParseFn) { this.genericParse = parseFn; }
}

/*
* Identify proper parser for seg and ref elements on the basis of content and attributes
*/
@xmlParser('note', DisambiguationSourcesParser)
@xmlParser('ref', DisambiguationSourcesParser)
@xmlParser('seg', DisambiguationSourcesParser)
@xmlParser('evt-sources-disambiguation', DisambiguationSourcesParser)
export class DisambiguationSourcesParser extends BasicParser implements Parser<XMLElement> {

    elementParser = createParser(GenericElemParser, parse);
    quoteParser = createParser(QuoteParser, this.genericParse);
    analogueParser = createParser(AnalogueParser, this.genericParse);

    elemAttrsToMatch = AppConfig.evtSettings.edition.externalBibliography.elementAttributesToMatch;
    analogueMarker = AppConfig.evtSettings.edition.analogueMarkers;
    exceptionParentElements = AppConfig.evtSettings.edition.sourcesExcludedFromListByParent;

    parse(xml: XMLElement): GenericElement {

        // eslint-disable-next-line prefer-const
        let attributesCheck = false, analogueCheck = false;
        const isExcluded = (this.exceptionParentElements.includes(xml.parentElement.tagName));
        this.elemAttrsToMatch.forEach((attr) => { if (xml.getAttribute(attr) !== null) { attributesCheck = true } });
        this.analogueMarker.forEach((marker) => { if (xml.getAttribute('type') === marker) { analogueCheck = true } } )

        if (analogueCheck) {
            // the element has the @attribute marker for analogues
            return this.analogueParser.parse(xml);
        }

        if ((attributesCheck) && (!isExcluded)) {
            // if the element has the @attribute pointing to an external bibl/cit
            return this.quoteParser.parse(xml);
        }

        return this.elementParser.parse(xml);
    }
}
@xmlParser('quote', QuoteParser)
//@xmlParser('cit', QuoteParser)
@xmlParser('evt-quote-entry-parser', QuoteParser)
export class QuoteParser extends BasicParser implements Parser<XMLElement> {

    elementParser = createParser(GenericElemParser, parse);
    attributeParser = createParser(AttributeParser, this.genericParse);
    biblParser = createParser(BibliographyParser, this.genericParse);
    analogueParser = createParser(AnalogueParser, this.genericParse);
    //msDescParser = createParser(MsDescParser, this.genericParse);

    analogueMarker = AppConfig.evtSettings.edition.analogueMarkers;
    extMatch = AppConfig.evtSettings.edition.externalBibliography.biblAttributeToMatch;
    intAttrsToMatch = AppConfig.evtSettings.edition.externalBibliography.elementAttributesToMatch;
    elements = 'bibl, cit, note, seg';

    xpathRegex = /\sxpath=[\"\'].*[\"\']/g;

    public parse(quote: XMLElement): QuoteEntry {
        // we have 4 cases:
        // <quote> inside a <cit>
        // <quote> alone,
        // <seg source/target="">
        // <ref source/target="">
        const isInCit = ((quote.parentElement.tagName === 'cit') || (quote.parentElement.tagName === 'note'));
        const isCit = ((quote.tagName === 'cit') || (quote.tagName === 'note'));
        const isQuote = (quote.tagName === 'quote');
        const isAnalogue = ((this.analogueMarker.includes(quote.getAttribute('type')))
            || (this.analogueMarker.includes(quote.parentElement.getAttribute('type'))));
        const sources = this.getInsideSources(quote, isInCit);
        const extSources = getExternalElements(this.findExtRef(quote, isInCit), this.intAttrsToMatch, this.extMatch, this.elements)
            .map((x) => this.biblParser.parse(x));

        return {
            type: QuoteEntry,
            id: getID(quote),
            tagName: quote.tagName,
            attributes: this.attributeParser.parse(quote),
            text: chainFirstChildTexts(this.getQuoteElement(quote, isCit)),
            sources: sources,
            extSources: extSources,
            quotedText: this.getQuotedTextFromSources(sources.concat(extSources)),
            class: ( (!isAnalogue) && (!isCit) && ( (!isInCit) || ((isInCit) && (isQuote)) ) ) ? SourceClass : quote.tagName.toLowerCase(),
            insideCit: isInCit,
            content: parseChildren(quote, this.genericParse),
            originalEncoding: this.cleanXMLString(quote, isInCit),
        };
    }

    /**
     * Returns first quote inside this quote entry
     * @param quote XMLElement
     * @returns XMLElement
     */
    private getQuoteElement(quote: XMLElement, isCit: boolean): XMLElement {
        if (isCit) {
            return Array.from(quote.querySelectorAll<XMLElement>('quote'))[0];
        }

        return quote;
    }

    /**
     * Remove unwanted output from XML string
     * @param quote XMLElement
     * @param inCitElem boolean
     * @returns String
     */
    private cleanXMLString(quote: XMLElement, inCitElem: boolean): string {
        if (inCitElem) {
            return getOuterHTML(quote.parentElement).replace(this.xpathRegex,'');
        }

        return getOuterHTML(quote).replace(this.xpathRegex,'');
    }


    /**
     * Retrieve attributes linked to external bibl/listBibl/cit elements
     * @param quote XMLElement
     * @param insideCit boolean
     * @returns XMLElement
     */
    private findExtRef(quote: XMLElement, inCitElem: boolean): XMLElement {
        const target = (inCitElem) ? quote.parentElement : quote;
        const linkAttr = Array.from(target.querySelectorAll<XMLElement>('[' +this.intAttrsToMatch.join('], [')+ ']')).map((x) => x);
        if (linkAttr.length > 0) {
            return linkAttr[0];
        }

        return target;
    }

    /**
     * Retrieve and send to the proper parsing all bibliography elements inside the quote element
     * @param quote XMLElement
     * @returns array of Bibliography Element or a single Bibliography List element
     */
    private getInsideSources(quote: XMLElement, isInCit: boolean): BibliographicEntry[] {
        const elemParserAssoc = {
            bibl: this.biblParser,
            listBibl: this.biblParser,
            //msDesc: this.msDescParser,
            biblStruct: this.biblParser,
            ref: this.biblParser,
            note: this.biblParser,
        }

        const analogueMarker = AppConfig.evtSettings.edition.analogueMarkers;
        const target = (isInCit) ? quote.parentElement.children : quote.children;

        return Array.from(target)
            .map((x: XMLElement) => (elemParserAssoc[x['tagName']]) ? elemParserAssoc[x['tagName']].parse(x) : null)
            .filter((x) => x)
            .filter((x) => !analogueMarker.includes(x['type']))
    }

    private getQuotedTextFromSources(nodes: BibliographicEntry[]): string[] {
        let quotesInSources = [];

        nodes.forEach((el: BibliographicEntry|BibliographicList|BibliographicStructEntry) => {
            if (el.type === BibliographicList) {
                quotesInSources = quotesInSources.concat(this.getQuotedTextFromSources(el['sources']));
            } else if (el.type === BibliographicEntry) {
                if (el['quotedText'] !== null) {
                    quotesInSources.push({ id: el.id, quote: el['quotedText'] });
                }
            };
        });

        return quotesInSources;
    }

}
