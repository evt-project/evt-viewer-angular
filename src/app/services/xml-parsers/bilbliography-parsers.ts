import { parse, xmlParser } from '.';
import { BibliographicEntry, BibliographicList, BibliographicStructEntry, BibliographyClass, XMLElement } from '../../models/evt-models';
import { getOuterHTML } from '../../utils/dom-utils';
import { AttributeParser, GenericElemParser } from './basic-parsers';
import { createParser, getID, parseChildren, ParseFn, Parser } from './parser-models';

export class BasicParser {
    genericParse: ParseFn;
    constructor(parseFn: ParseFn) { this.genericParse = parseFn; }
}

@xmlParser('listBibl', BibliographyParser)
@xmlParser('biblStruct', BibliographyParser)
@xmlParser('bibl', BibliographyParser)
@xmlParser('evt-bibliographic-entry-parser', BibliographyParser)
export class BibliographyParser extends BasicParser implements Parser<XMLElement> {

    protected attributeParser = createParser(AttributeParser, this.genericParse);
    protected elementParser = createParser(GenericElemParser, parse);

    protected getTrimmedText = function(s) {
        return s.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
    }

    protected getChildrenTextByName = function(xml : XMLElement, name : string) {
        return Array.from(xml.querySelectorAll<XMLElement>(name)).map((x) => ' '+this.getTrimmedText(x));
    }

    protected getChildrenByNameOnFirstLevelOnly = function(xml : XMLElement, name : string) {
        return Array.from(xml.querySelectorAll<XMLElement>(':scope > '+name)).map((x) => this.getTrimmedText(x));
    }

    protected getChildrenTextAndSpecificAttribute = function(xml: XMLElement, name: string, attribute: string) {
        return Array.from(xml.querySelectorAll<XMLElement>(name)).map((x) => x.getAttribute(attribute)+' '+this.getTrimmedText(x));
    }

    protected getQuoteElementText(element: XMLElement): string {
        const target = (element.parentNode['tagName'] === 'cit' || element.parentNode['tagName'] === 'note') ? element.parentNode : element;
        const search = Array.from(target.querySelectorAll<XMLElement>('quote'));
        if (search.length !== 0) {
            return search[0].textContent;
        }

        return null;
    }

    parse(xml: XMLElement): any {

        switch (xml.tagName) {
            case 'ref':
            case 'analytic':
            case 'series':
            case 'monogr':
            case 'bibl':
                return {
                    type: BibliographicEntry,
                    id: getID(xml),
                    class: BibliographyClass,
                    attributes: this.attributeParser.parse(xml),
                    title: this.getChildrenTextByName(xml,'title'),
                    author: this.getChildrenTextByName(xml,'author'),
                    editor: this.getChildrenTextByName(xml,'editor'),
                    date: this.getChildrenTextByName(xml,'date'),
                    publisher: this.getChildrenTextByName(xml,'publisher'),
                    pubPlace: this.getChildrenTextByName(xml,'pubBlace'),
                    citedRange: this.getChildrenTextByName(xml,'citedRange'),
                    biblScope: this.getChildrenTextAndSpecificAttribute(xml, 'biblScope', 'unit'),
                    content: parseChildren(xml, this.genericParse),
                    text: xml.textContent,
                    quotedText: this.getQuoteElementText(xml),
                    insideCit: (xml.parentNode['tagName'] === 'cit' || xml.parentNode['tagName'] === 'note'),
                    originalEncoding: getOuterHTML(xml),
                };
            case 'cit':
            case 'listBibl':
            case 'note':
                return {
                    type: BibliographicList,
                    id: getID(xml),
                    attributes: this.attributeParser.parse(xml),
                    head: Array.from(xml.querySelectorAll<XMLElement>('head')).map((x) => x.textContent),
                    sources: Array.from(xml.querySelectorAll<XMLElement>('bibl')).map((x) => this.parse(x)),
                    content: parseChildren(xml, this.genericParse),
                };
            case 'biblStruct':
                return {
                    type: BibliographicStructEntry,
                    id: getID(xml),
                    attributes: this.attributeParser.parse(xml),
                    analytic: Array.from(xml.querySelectorAll<XMLElement>('analytic')).map((x) => this.parse(x)),
                    monogrs: Array.from(xml.querySelectorAll<XMLElement>('monogr')).map((x) => this.parse(x)),
                    series: Array.from(xml.querySelectorAll<XMLElement>('series')).map((x) => this.parse(x)),
                    content: parseChildren(xml, this.genericParse),
                    originalEncoding: getOuterHTML(xml),
                };
            default:
                return this.elementParser.parse(xml)
        }
    }
}
