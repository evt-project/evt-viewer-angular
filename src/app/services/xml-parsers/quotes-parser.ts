import { xmlParser } from '.';
import { BibliographicEntry, ParallelPassage, QuoteEntry, XMLElement } from '../../models/evt-models';
import { AnalogueParser } from './analogue-parser';
import { AttributeParser, BibliographyListParser, BibliographyParser, EmptyParser } from './basic-parsers';
import { createParser, getID, parseChildren, Parser } from './parser-models';
import { getOuterHTML } from 'src/app/utils/dom-utils';
import { chainFirstChildTexts } from 'src/app/utils/xml-utils';

@xmlParser('evt-quote-entry-parser', QuoteParser)
export class QuoteParser extends EmptyParser implements Parser<XMLElement> {

    attributeParser = createParser(AttributeParser, this.genericParse);
    biblParser = createParser(BibliographyParser, this.genericParse);
    listBiblParser = createParser(BibliographyListParser, this.genericParse);
    parallelPassageParser = createParser(AnalogueParser, this.genericParse);

    public parse(quoteEntry: XMLElement): QuoteEntry {
        return {
            type: QuoteEntry,
            id: getID(quoteEntry),
            attributes: this.attributeParser.parse(quoteEntry),
            text: chainFirstChildTexts(quoteEntry),
            content: parseChildren(quoteEntry, this.genericParse),
            sources: this.getSources(quoteEntry),
            extSources: this.getExternalSources(quoteEntry),
            ref: this.getParallelPassages(quoteEntry),
            class: quoteEntry.tagName.toLowerCase(),
            originalEncoding: getOuterHTML(quoteEntry),
        };
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
            .map((x: XMLElement) => bibl.includes(x['tagName']) ? this.biblParser.parse(x) : (
                biblList.includes(x['tagName']) ? this.listBiblParser.parse(x) : null))
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
            .map((x: XMLElement) => (
                    (classList.includes(x['tagName'])) && (x['attributes'].getNamedItem('type').nodeValue === parallelPassageType)
                ) ? this.parallelPassageParser.parse(x) : null)
            .filter((x) => x);
    }

     /**
     * Retrieve external bibliography element outside the analogue element
     * This first solution is brutal: it searches all document for a bibl with the correct xml:id
     * it would be faster if we knew the id or unique element to search in
     * @param analogue XMLElement
     * @returns array of Bibliography Element
     */
    private getExternalSources(analogue: XMLElement): BibliographicEntry[] {
        const sourcesToFind = [analogue.getAttribute('target'), analogue.getAttribute('source')]
                .filter((x) => x)
                .map((x) => x.replace('#',''));

        const sourcesFound = Array.from(analogue.ownerDocument.querySelectorAll<XMLElement>('bibl'))
                .filter((x) => sourcesToFind.includes(x.getAttribute('xml:id')))
                .map((x) => this.biblParser.parse(x));

        return sourcesFound;
    }


}
