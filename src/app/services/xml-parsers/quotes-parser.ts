import { xmlParser } from '.';
import { ParallelPassage, QuoteEntry, XMLElement } from '../../models/evt-models';
import { AttributeParser, BibliographyListParser, BibliographyParser, EmptyParser, ParallelPassageParser } from './basic-parsers';
import { createParser, getID, Parser } from './parser-models';
import { getOuterHTML } from 'src/app/utils/dom-utils';

@xmlParser('evt-quote-entry-parser', QuoteParser)
export class QuoteParser extends EmptyParser implements Parser<XMLElement> {

    attributeParser = createParser(AttributeParser, this.genericParse);
    biblParser = createParser(BibliographyParser, this.genericParse);
    listBiblParser = createParser(BibliographyListParser, this.genericParse);
    parallelPassageParser = createParser(ParallelPassageParser, this.genericParse);

    public parse(quoteEntry: XMLElement): QuoteEntry {
        return {
            type: QuoteEntry,
            id: getID(quoteEntry),
            attributes: this.attributeParser.parse(quoteEntry),
            text: this.getFirstChildText(quoteEntry),
            content: this.getSources(quoteEntry),
            ref: this.getParallelPassages(quoteEntry),
            class: quoteEntry.tagName.toLowerCase(),
            originalEncoding: getOuterHTML(quoteEntry),
        };
    }

    /**
     * Significant text can be split inside two or more text evt-element, especially if contains new line characters.
     * This function returns a string with all the text element chained
     * @param n XMLElement
     * @returns string
     */
    private getFirstChildText(n: XMLElement): string {
        const evtTextElement = '#text';
        let out = '';
        n.childNodes.forEach((x) => (x.nodeName === evtTextElement) ? out += x.nodeValue : '')

        return out;
    }

    /**
     * Retrieve and send to parsing all Bibliography elements inside this quote element
     * @param quote XMLElement
     * @returns array of Bibliography Element or a single Bibliography List element
     */
    private getSources(quote: XMLElement): any {
        const bibl = ['bibl'];
        const biblList = ['listBibl'];

        return Array.from(quote.children)
            .map((x: XMLElement) => bibl.includes(x['tagName']) ? this.biblParser.parse(x) :
                (biblList.includes(x['tagName']) ? this.listBiblParser.parse(x) : null ))
            .filter((x) => x);
    }


    /**
     * Retrieve all <ref> with a specific type attribute inside this quote element
     * @param quote XMLElement
     * @returns array of parallel passage elements
     */
    private getParallelPassages(quote: XMLElement): ParallelPassage[] {
        const classList = ['ref']; // tutti i ref con type = 'parallelPassage'
        const parallelPassageType = 'parallelPassage';

        return Array.from(quote.children)
            .map((x: XMLElement) => ((classList.includes(x['tagName'])) && 
                (x['attributes'].getNamedItem('type').nodeValue === parallelPassageType)) ? this.parallelPassageParser.parse(x) : null)
            .filter((x) => x);
    }


}
