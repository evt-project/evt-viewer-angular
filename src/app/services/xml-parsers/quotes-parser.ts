import { AppConfig } from 'src/app/app.config';
import { parse, xmlParser } from '.';
import { BibliographicEntry, BibliographicList, BibliographicStructEntry, 
    GenericElement, QuoteEntry, SourceClass, XMLElement } from '../../models/evt-models';
import { AnalogueParser } from './analogue-parser';
import { AttributeParser, GenericElemParser } from './basic-parsers';
import { createParser, getID, parseChildren, ParseFn, Parser } from './parser-models';
import { getOuterHTML } from 'src/app/utils/dom-utils';
import { chainFirstChildTexts, isAnalogue, isSource } from 'src/app/utils/xml-utils';
//import { MsDescParser } from './msdesc-parser';
import { BibliographyParser } from './bilbliography-parsers';

export class BasicParser {
    genericParse: ParseFn;
    constructor(parseFn: ParseFn) { this.genericParse = parseFn; }
}

@xmlParser('note', QuoteParser)
@xmlParser('ref', QuoteParser)
@xmlParser('seg', QuoteParser)
@xmlParser('quote', QuoteParser)
//@xmlParser('cit', SourceParser)
@xmlParser('evt-quote-entry-parser', QuoteParser)
export class QuoteParser extends BasicParser implements Parser<XMLElement> {

    elementParser = createParser(GenericElemParser, parse);
    attributeParser = createParser(AttributeParser, this.genericParse);
    biblParser = createParser(BibliographyParser, this.genericParse);
    analogueParser = createParser(AnalogueParser, this.genericParse);
    //msDescParser = createParser(MsDescParser, this.genericParse);

    analogueMarkers = AppConfig.evtSettings.edition.analogueMarkers;
    extMatch = AppConfig.evtSettings.edition.externalBibliography.biblAttributeToMatch;
    intAttrsToMatch = AppConfig.evtSettings.edition.externalBibliography.elementAttributesToMatch;
    exceptionParentElements = AppConfig.evtSettings.edition.sourcesExcludedFromListByParent;
    elementsAllowedForSources = 'bibl, cit, note, seg'; // bibliography
    elementsAllowedForLink = 'seg, ref, quote, cit, div'; // nested quote elements

    xpathRegex = /\sxpath=[\"\'].*[\"\']/g;

    public parse(quote: XMLElement): QuoteEntry|GenericElement {

        switch(quote.tagName) {
            case 'ptr':
            case 'seg':
            case 'ref':
            case 'note':
                const isExcluded = (this.exceptionParentElements.includes(quote.parentElement.tagName));
                if (isAnalogue(quote, this.analogueMarkers)) {
                    // the element has the @attribute marker for analogues
                    return this.analogueParser.parse(quote);
                }
                if ((!isSource(quote, this.intAttrsToMatch)) || (isExcluded)) {
                    // if the element has the @attribute pointing to an external bibl/cit
                    return this.elementParser.parse(quote);
                }
        }
        // remains 6 cases:
        // <quote> inside a <cit>
        // <quote> alone,
        // <seg @source/@target="">
        // <ref @source/@target="">
        // ptr <ref @source/@target="">
        // note <ref @source/@target="">
        const isInCit = ((quote.parentElement.tagName === 'cit') || (quote.parentElement.tagName === 'note'));
        const isCit = ((quote.tagName === 'cit') || (quote.tagName === 'note'));
        const isQuote = (quote.tagName === 'quote');
        const isAnalogueCheck = ((isAnalogue(quote, this.analogueMarkers)) || (isAnalogue(quote.parentElement, this.analogueMarkers)));
        const sources = this.getInsideSources(quote, isInCit);
        /*
        const extSources = getExternalElements(this.findExtRef(quote, isInCit), this.intAttrsToMatch, this.extMatch, this.elementsAllowedForSources)
            .map((x) => this.biblParser.parse(x));
        const extElements = getExternalElements(this.findExtRef(quote, isInCit), this.intAttrsToMatch, this.extMatch, this.elementsAllowedForLink)
            .map((x) => this.parse(x));  // do not apply class?
        */
        const ext = this.getExternalElemsOnce(this.findExtRef(quote, isInCit), this.intAttrsToMatch, this.extMatch);

        return {
            type: QuoteEntry,
            id: getID(quote),
            tagName: quote.tagName,
            attributes: this.attributeParser.parse(quote),
            text: chainFirstChildTexts(this.getQuoteElement(quote, isCit)),
            sources: sources,
            extSources: ext.extSources,
            extElements: ext.extElements,
            quotedText: this.getQuotedTextFromSources(sources.concat(ext.extSources)),
            class: ( (!isAnalogueCheck) && (!isCit) && ( (!isInCit) || ((isInCit) && (isQuote)) ) ) ? SourceClass : quote.tagName.toLowerCase(),
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

        /**
    * Retrieve and send to the proper parsing all elements outside the quote element and linked by their @xml:id
    * @param quote XMLElement
    * @param attrSrcNames string[]
    * @oaram attrTrgtName string
    * @returns array of Bibliography Element or a single Bibliography List element
    */
    private getExternalElemsOnce(quote: XMLElement, attrSrcNames: string[], attrTrgtName: string): any {
        const out = { extElements: [], extSources: [] };
        const sourceIDs = attrSrcNames.map((x) => quote.getAttribute(x));
        const sourcesToFind = sourceIDs.filter((x) => x).map((x) => x.replace('#',''));
        const elemParserAssoc = {
            bibl: { extSources: this.biblParser },
            listBibl: { extSources: this.biblParser },
            //msDesc: { extSources: this.msDescParser },
            biblStruct: { extSources: this.biblParser },
            seg: { extSources: this.biblParser, extElements: this },
            ref: { extSources: this.biblParser, extElements: this },
            note: { extElements: this },
            quote: { extElements: this },
            cit: { extElements: this },
            div: { extElements: this },
        }

        if (sourcesToFind.length > 0) {
            const partial = Array.from(quote.ownerDocument.querySelectorAll<XMLElement>(Object.keys(elemParserAssoc).join(',')))
                .filter((x) => sourcesToFind.includes(x.getAttribute(attrTrgtName)))

            partial.forEach((x: XMLElement) => {
                if (elemParserAssoc[x['tagName']]) {
                    Object.keys(elemParserAssoc[x['tagName']]).forEach((destination) => {
                        const relativeParser = elemParserAssoc[x['tagName']][destination];
                        out[destination].push( relativeParser.parse(x) )
                    })
                };
            });
        }

        return out;
    }

    /**
     * Inside 'quotedText' attribute of BibliographicEntry is stored the quoted text
     * @param nodes BibliographicEntry[]
     * @returns array of object { id: '', 'quote':'' }
     */
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
