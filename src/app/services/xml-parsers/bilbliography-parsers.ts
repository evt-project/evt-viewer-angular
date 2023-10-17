import { xmlParser } from '.';
import { GenericElemParser } from './basic-parsers';
import { BibliographicEntry, BibliographicList, BibliographicStructEntry, XMLElement } from '../../models/evt-models';
import { getOuterHTML } from '../../utils/dom-utils';
import { createParser, getID, parseChildren, Parser } from './parser-models';

export class BiblParser extends GenericElemParser {
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
        const search = Array.from(element.querySelectorAll<XMLElement>('quote'));
        if (search.length !== 0) {
            return search[0].textContent;
        }

        return '';
    }
}

export class ListBiblParser extends BiblParser {
    protected biblParser = createParser(BibliographyParser, this.genericParse);
}

@xmlParser('bibl', BibliographyParser)
export class BibliographyParser extends BiblParser implements Parser<XMLElement> {
    parse(xml: XMLElement): BibliographicEntry {
        return {
            type: BibliographicEntry,
            id: getID(xml),
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
            insideCit: (xml.parentNode['tagName'] === 'cit'),
            originalEncoding: getOuterHTML(xml),
        };
    }
}

@xmlParser('listBibl', BibliographyListParser)
export class BibliographyListParser extends ListBiblParser implements Parser<XMLElement> {
    parse(xml: XMLElement): BibliographicList {
        return {
            type: BibliographicList,
            id: getID(xml),
            attributes: this.attributeParser.parse(xml),
            head: Array.from(xml.querySelectorAll<XMLElement>('head')).map((x) => x.textContent),
            sources: Array.from(xml.querySelectorAll<XMLElement>('bibl')).map((x) => this.biblParser.parse(x)),
            content: parseChildren(xml, this.genericParse),
        };
    }
}

@xmlParser('biblStruct', BibliographyStructParser)
export class BibliographyStructParser extends ListBiblParser implements Parser<XMLElement> {
    parse(xml: XMLElement): BibliographicStructEntry {
        return {
            type: BibliographicStructEntry,
            id: getID(xml),
            attributes: this.attributeParser.parse(xml),
            analytic: Array.from(xml.querySelectorAll<XMLElement>('analytic')).map((x) => this.biblParser.parse(x)),
            monogrs: Array.from(xml.querySelectorAll<XMLElement>('monogr')).map((x) => this.biblParser.parse(x)),
            series: Array.from(xml.querySelectorAll<XMLElement>('series')).map((x) => this.biblParser.parse(x)),
            content: parseChildren(xml, this.genericParse),
            originalEncoding: getOuterHTML(xml),
        };
    }
}
