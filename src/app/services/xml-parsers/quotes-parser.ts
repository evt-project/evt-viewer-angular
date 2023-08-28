import { AppConfig } from 'src/app/app.config';
import { xmlParser } from '.';
import { BibliographicEntry, GenericElement, QuoteEntry, XMLElement, SourceClass } from '../../models/evt-models';
import { AnalogueParser } from './analogue-parser';
import { AttributeParser, EmptyParser, GenericElemParser } from './basic-parsers';
import { createParser, getID, parseChildren, Parser } from './parser-models';
import { getOuterHTML } from 'src/app/utils/dom-utils';
import { chainFirstChildTexts, getExternalSources } from 'src/app/utils/xml-utils';
import { MsDescParser } from './msdesc-parser';
import { BibliographyListParser, BibliographyParser, BibliographyStructParser } from './bilbliography-parsers';

/*
* Identify proper parser for seg and ref elements on the basis of content and attributes
*/
@xmlParser('ref', DisambiguationSegParser)
@xmlParser('seg', DisambiguationSegParser)
export class DisambiguationSegParser extends EmptyParser implements Parser<XMLElement> {

    elementParser = createParser(GenericElemParser, this.genericParse);
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
            // so it's part of a quote
            return this.quoteParser.parse(xml);
        }

        return this.elementParser.parse(xml);
    }
}
@xmlParser('quote', QuoteParser)
//@xmlParser('cit', QuoteParser)
@xmlParser('evt-quote-entry-parser', QuoteParser)
export class QuoteParser extends EmptyParser implements Parser<XMLElement> {

    attributeParser = createParser(AttributeParser, this.genericParse);
    biblParser = createParser(BibliographyParser, this.genericParse);
    listBiblParser = createParser(BibliographyListParser, this.genericParse);
    analogueParser = createParser(AnalogueParser, this.genericParse);
    msDescParser = createParser(MsDescParser, this.genericParse);
    biblStructParser = createParser(BibliographyStructParser, this.genericParse)

    analogueMarker = AppConfig.evtSettings.edition.analogueMarkers;
    extMatch = AppConfig.evtSettings.edition.externalBibliography.biblAttributeToMatch;
    intAttrsToMatch = AppConfig.evtSettings.edition.externalBibliography.elementAttributesToMatch;

    xpathRegex = /\sxpath=[\"\'].*[\"\']/g;

    public parse(quote: XMLElement): QuoteEntry {
        // we have 4 cases:
        // <quote> inside a <cit>
        // <quote> alone,
        // <seg source/target="">
        // <ref source/target="">
        const isInCit = (quote.parentElement.tagName === 'cit');
        const isCit = (quote.tagName === 'cit');
        const isQuote = (quote.tagName === 'quote');
        const isAnalogue = ((analogueMarker.includes(quote.getAttribute('type')))
            || (analogueMarker.includes(quote.parentElement.getAttribute('type'))));
        const sources = this.getInsideSources(quote);

        return {
            type: QuoteEntry,
            id: getID(quote),
            tagName: quote.tagName,
            attributes: this.attributeParser.parse(quote),
            text: chainFirstChildTexts(this.getQuoteElement(quote)),
            sources: sources,
            extSources: getExternalSources(this.findExtRef(quote, isInCit), this.intAttrsToMatch, this.extMatch).map((x) => this.biblParser.parse(x)),
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
    private getQuoteElement(quote: XMLElement): XMLElement {
        if (quote.tagName === 'cit') {
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
    private getInsideSources(quote: XMLElement): BibliographicEntry[] {
        const elemParserAssoc = {
            bibl: this.biblParser,
            listBibl: this.listBiblParser,
            msDesc: this.msDescParser,
            biblStruct: this.biblStructParser,
            ref: this.biblParser,
        }

        if (quote.parentElement.tagName === 'cit') {
            // if quote is inside a cit element then the biblographic element is at its same level and not inside
            return Array.from(quote.parentElement.children)
            .map((x: XMLElement) => (elemParserAssoc[x['tagName']]) ? elemParserAssoc[x['tagName']].parse(x) : null)
            .filter((x) => x);
        }

        return Array.from(quote.children)
            .map((x: XMLElement) => (elemParserAssoc[x['tagName']]) ? elemParserAssoc[x['tagName']].parse(x) : null)
            .filter((x) => x);
    }

}
