import { AppConfig } from 'src/app/app.config';
import { xmlParser } from '.';
import { BibliographicEntry, QuoteEntry, XMLElement } from '../../models/evt-models';
import { AnalogueParser } from './analogue-parser';
import { AttributeParser, EmptyParser } from './basic-parsers';
import { createParser, getID, parseChildren, Parser } from './parser-models';
import { getOuterHTML } from 'src/app/utils/dom-utils';
import { chainFirstChildTexts, getExternalSources } from 'src/app/utils/xml-utils';
import { MsDescParser } from './msdesc-parser';
import { BibliographyListParser, BibliographyParser, BibliographyStructParser } from './bilbliography-parsers';

@xmlParser('evt-quote-entry-parser', QuoteParser)
export class QuoteParser extends EmptyParser implements Parser<XMLElement> {

    attributeParser = createParser(AttributeParser, this.genericParse);
    biblParser = createParser(BibliographyParser, this.genericParse);
    listBiblParser = createParser(BibliographyListParser, this.genericParse);
    parallelPassageParser = createParser(AnalogueParser, this.genericParse);
    msDescParser = createParser(MsDescParser, this.genericParse);
    biblStructParser = createParser(BibliographyStructParser, this.genericParse)

    biblAttrToMatch = AppConfig.evtSettings.edition.externalBibliography.biblAttributeToMatch;
    elemAttrsToMatch = AppConfig.evtSettings.edition.externalBibliography.elementAttributesToMatch;

    xpathRegex = /\sxpath=[\"\'].*[\"\']/g;

    public parse(quote: XMLElement): QuoteEntry {
        // we have 2 cases: <quote> inside a <cit>, <quote> alone
        const isInsideCitElem = (quote.parentElement.tagName === 'cit');
        const sources = this.getInsideSources(quote);

        return {
            type: QuoteEntry,
            id: getID(quote),
            tagName: quote.tagName,
            attributes: this.attributeParser.parse(quote),
            text: chainFirstChildTexts(quote),
            sources: sources,
            extSources: getExternalSources(this.findExtRef(quote, isInsideCitElem), this.elemAttrsToMatch, this.biblAttrToMatch).map(
                (x) => this.biblParser.parse(x)),
            class: 'quoteEntry',
            insideCit: isInsideCitElem,
            content: parseChildren(quote, this.genericParse),
            originalEncoding: (isInsideCitElem) ? getOuterHTML(quote.parentElement).replace(this.xpathRegex,'') : getOuterHTML(quote),
        };
    }


    /**
     * Retrieve attributes linked to external bibl/listBibl/cit elements
     * @param quote XMLElement
     * @param insideCit boolean
     * @returns XMLElement
     */
    private findExtRef(quote: XMLElement, insideCit: boolean): XMLElement {
        const target = (insideCit) ? quote.parentElement : quote;
        const linkAttr = Array.from(target.querySelectorAll<XMLElement>('[' +this.elemAttrsToMatch.join('], [')+ ']')).map((x) => x);
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
