import { AppConfig } from 'src/app/app.config';
import { ParserRegister, xmlParser } from '.';
import { Analogue, BibliographicEntry, BibliographicList, BibliographicStructEntry,
    GenericElement, Note, Paragraph, Ptr, QuoteEntry, SourceClass, Verse, VersesGroup,
    XMLElement } from '../../models/evt-models';
import { AnalogueParser } from './analogue-parser';
import { createParser, getID, parseChildren, ParseFn, Parser } from './parser-models';
import { getOuterHTML } from 'src/app/utils/dom-utils';
import { isAnalogue, isSource, normalizeSpaces } from 'src/app/utils/xml-utils';
import { BibliographyParser } from './bilbliography-parsers';
import { chainFirstChildTexts } from '../../utils/xml-utils';
import { GenericElemParser } from './basic-parsers';

export class BasicParser {
    genericParse: ParseFn;
    constructor(parseFn: ParseFn) { this.genericParse = parseFn; }
}

@xmlParser('ref', QuoteParser)
@xmlParser('seg', QuoteParser)
@xmlParser('quote', QuoteParser)
@xmlParser('cit', QuoteParser)
@xmlParser('div', QuoteParser)
//@xmlParser('note', QuoteParser) on redirect from their parser
//@xmlParser('p', QuoteParser) "
//@xmlParser('l', QuoteParser) "
//@xmlParser('lb', QuoteParser) "
//@xmlParser('ptr', QuoteParser) "
@xmlParser('evt-quote-entry-parser', QuoteParser)
export class QuoteParser extends BasicParser implements Parser<XMLElement> {

    elementParser = createParser(GenericElemParser, this.genericParse);
    attributeParser = ParserRegister.get('evt-attribute-parser');
    msDescParser = ParserRegister.get('msDesc');
    biblParser = createParser(BibliographyParser, this.genericParse);
    analogueParser = createParser(AnalogueParser, this.genericParse);

    analogueMarkers = AppConfig.evtSettings.edition.analogueMarkers;
    extMatch = AppConfig.evtSettings.edition.externalBibliography.biblAttributeToMatch;
    intAttrsToMatch = AppConfig.evtSettings.edition.externalBibliography.elementAttributesToMatch;
    exceptionParentElements = AppConfig.evtSettings.edition.sourcesExcludedFromListByParent;
    elementsAllowedForSources = 'bibl, cit, note, seg'; // bibliography
    elementsAllowedForLink = 'seg, ref, quote, cit, div'; // nested quote elements
    notNiceInText = ['Note', 'BibliographicList', 'BibliographicEntry',
    'BibliographicStructEntry', 'Analogue', 'MsDesc'];

    xpathRegex = /\sxpath=[\"\'].*[\"\']/g;

    public parse(quote: XMLElement): QuoteEntry | Note | GenericElement | Analogue {

        const isExcluded = (quote.parentElement) && (this.exceptionParentElements.includes(quote.parentElement.tagName));

        if (isAnalogue(quote, this.analogueMarkers)) {
            // the element has the @attribute marker for analogues
            return this.analogueParser.parse(quote);
        }

        const notSource = ((!isSource(quote, this.intAttrsToMatch)) || (isExcluded));

        switch(quote.tagName) {
            case 'p':
            case 'lg':
            case 'l':
            case 'note':
                // if they are not a source send them to their parse
                // otherwise create a note
                if (notSource) {
                    return ParserRegister.get(quote.tagName).parse(quote) as Paragraph|VersesGroup|Verse|Note;
                }

                return this.createNote(quote);
            case 'div':
                // if it's not a source create a generic element
                // if it's a source add a note to the generic element
                const divElement = ParserRegister.get('evt-generic-elem-parser').parse(quote) as GenericElement;
                if (notSource) {
                    return divElement;
                }
                divElement.content.push( this.createNote(quote) );

                return divElement;
            case 'ptr':
                // if it's not a source send it to its parse
                 // otherwise parse here
                 if (notSource) {
                    return ParserRegister.get(quote.tagName).parse(quote) as Ptr;
                }
                break;
            case 'ref':
            case 'seg':
                // if they are not a source create a generic element
                // otherwise parse here
                if (notSource) {
                    return ParserRegister.get('evt-generic-elem-parser').parse(quote) as GenericElement;
                }
                break;
            case 'quote':
            case 'cit':
                // always parse here
                break;
        }

        // remains 6 cases:
        // <quote> inside a <cit>
        // <quote> alone,
        // <seg @source/@target="">
        // <ref @source/@target="">
        // ptr <ref @source/@target="">
        // note <ref @source/@target="">

        const isInCit = ((quote.parentElement !== null) && ((quote.parentElement.tagName === 'cit') || (quote.parentElement.tagName === 'note')));
        const isCit = ((quote.tagName === 'cit') || (quote.tagName === 'note'));
        const isDiv = (quote.tagName === 'div');
        const isQuote = (quote.tagName === 'quote');
        const isAnalogueCheck = ((isAnalogue(quote, this.analogueMarkers)) || (
            (quote.parentElement !== null) && (isAnalogue(quote.parentElement, this.analogueMarkers))
        ));
        const inside = this.getInsideSources(quote, isInCit);
        const ext = this.getExternalElemsOnce(this.findExtRef(quote, isInCit), this.intAttrsToMatch, this.extMatch);
        const content = parseChildren(quote, this.genericParse);

        return <QuoteEntry> {
            type: QuoteEntry,
            id: getID(quote),
            tagName: quote.tagName,
            attributes: this.attributeParser.parse(quote),
            text: normalizeSpaces(this.getQuotedTextInside(quote, isCit, isDiv)),
            sources: inside.sources,
            extSources: ext.extSources,
            extElements: ext.extElements,
            quotedText: this.getQuotedTextFromSources(inside.sources.concat(ext.extSources)),
            analogues: ext.analogues.concat(inside.analogues),
            class: ( (!isAnalogueCheck) && (!isCit) && ( (!isInCit) || ((isInCit) && (isQuote)) ) ) ? SourceClass : quote.tagName.toLowerCase(),
            insideCit: isInCit,
            noteView: ((quote.tagName === 'note') || (quote.tagName === 'ptr')) ? true : false,
            content: content,
            contentToShow: content.filter((x) => !(this.notNiceInText.includes(x['type'].name))),
            originalEncoding: this.cleanXMLString(quote, isInCit),
        };
    }

    /**
     * Returns first-level text elements inside this quote entry
     * @param quote XMLElement
     * @returns XMLElement
     */
    private getQuotedTextInside(quote: XMLElement, isCit: boolean, isDiv: boolean): string {
        let outText = '';
        if ((isCit) || (isDiv)) {
            const elements = Array.from(quote.querySelectorAll<XMLElement>('quote, p, l, lg'));
            elements.forEach((el) => outText += chainFirstChildTexts(el));

            return outText;
        }

        return chainFirstChildTexts(quote);
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
    private getInsideSources(quote: XMLElement, isInCit: boolean): { sources:any, analogues:any } {
        const prsRg = {
            bibl: this.biblParser,
            listBibl: this.biblParser,
            biblStruct: this.biblParser,
            msDesc: this.msDescParser,
            cit: this.biblParser,
            ref: this.biblParser,
            note: this.biblParser,
        }

        const anlgAttr = AppConfig.evtSettings.edition.analogueMarkers;
        const target = (isInCit) ? quote.parentElement.children : quote.children;
        const out = { sources: [], analogues: [] }

        Array.from(target).forEach((element: XMLElement) => {
            if (prsRg[element['tagName']]) {
                if (!anlgAttr.includes(element.getAttribute('type'))) {
                    out.sources.push( prsRg[element['tagName']].parse(element) );
                } else {
                    const analogueParsed = this.parse(element);
                    if (analogueParsed['contentToShow']) {
                        out.analogues.push( analogueParsed['contentToShow'] );
                    }
                }
            }
        });

        return out;
    }

        /**
    * Retrieve and send to the proper parsing all elements outside the quote element and linked by their @xml:id
    * @param quote XMLElement
    * @param attrSrcNames string[]
    * @oaram attrTrgtName string
    * @returns array of Bibliography Element or a single Bibliography List element
    */
    private getExternalElemsOnce(quote: XMLElement, attrSrcNames: string[], attrTrgtName: string): any {
        const out = { extElements: [], extSources: [], analogues: [] };
        const sourceIDs = attrSrcNames.map((x) => quote.getAttribute(x));
        const sourcesToFind = sourceIDs.filter((x) => x).map((x) => x.replace('#',''));
        const anlgAttr = AppConfig.evtSettings.edition.analogueMarkers;
        const elemParserAssoc = {
            // bibliographic elements
            bibl: { extSources: this.biblParser },
            listBibl: { extSources: this.biblParser },
            msDesc: { extSources: this.msDescParser },
            biblStruct: { extSources: this.biblParser },

            note: { extElements: this },
            // this parser elements
            quote: { extElements: this },
            cit: { extElements: this },

            seg: { extSources: this.biblParser, extElements: this },
            ref: { extSources: this.biblParser, extElements: this },
            // possibile chained sources/analogues
            div: { extElements: this },
            p: { extElements: this },
            l: { extElements: this },
            lg: { extElements: this },
            // generic elements
            item: { extElements: this.elementParser },
        }

        if (sourcesToFind.length > 0) {
            const partial = Array.from(quote.ownerDocument.querySelectorAll<XMLElement>(Object.keys(elemParserAssoc).join(',')))
                .filter((x) => sourcesToFind.includes(x.getAttribute(attrTrgtName)))

            partial.forEach((x: XMLElement) => {
                if (elemParserAssoc[x['tagName']]) {
                    Object.keys(elemParserAssoc[x['tagName']]).forEach((destination) => {
                        if (anlgAttr.includes(x.getAttribute('type'))) {
                            const analogueParsed = this.parse(x);
                            if (analogueParsed['contentToShow']) {
                                out['analogues'].push( analogueParsed['contentToShow'] )
                            }
                        } else {
                            const relativeParser = elemParserAssoc[x['tagName']][destination];
                            out[destination].push( relativeParser.parse(x) )
                        }
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

    private createNote(quote: XMLElement) {
        // const sources = this.getInsideSources(quote, false);
        // not parsing inside sources, they will be parsed anyway
        const isCit = ((quote.tagName === 'cit') || (quote.tagName === 'note'));
        const isDiv = (quote.tagName === 'div');
        const ext = this.getExternalElemsOnce(quote, this.intAttrsToMatch, this.extMatch);
        const content = parseChildren(quote, this.genericParse);

        return <QuoteEntry> {
            type: QuoteEntry,
            id: 'EVT-SRC:'+getID(quote),
            tagName: quote.tagName,
            attributes: this.attributeParser.parse(quote),
            text: normalizeSpaces(this.getQuotedTextInside(quote, isCit, isDiv)),
            sources: [],
            analogues: ext.analogues,
            extSources: ext.extElements.concat(ext.extSources),
            extElements: ext.extElements,
            quotedText: this.getQuotedTextFromSources(ext.extElements.concat(ext.extSources)),
            class: SourceClass,
            insideCit: false,
            noteView: true,
            content: content,
            contentToShow: content.filter((x) => !(this.notNiceInText.includes(x['type'].name))),
            originalEncoding: this.cleanXMLString(quote, false),
        };
    }

}
