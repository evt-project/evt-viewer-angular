import { AppConfig } from 'src/app/app.config';
import { xmlParser } from '.';
import { GenericElement, ParallelPassage, QuoteEntry, XMLElement } from '../../models/evt-models';
import { AnalogueParser } from './analogue-parser';
import { AttributeParser, BibliographyListParser, BibliographyParser, EmptyParser } from './basic-parsers';
import { createParser, getID, parseChildren, Parser } from './parser-models';
import { getOuterHTML } from 'src/app/utils/dom-utils';
import { chainFirstChildTexts, getExternalSources } from 'src/app/utils/xml-utils';

@xmlParser('evt-quote-entry-parser', QuoteParser)
export class QuoteParser extends EmptyParser implements Parser<XMLElement> {

    attributeParser = createParser(AttributeParser, this.genericParse);
    biblParser = createParser(BibliographyParser, this.genericParse);
    listBiblParser = createParser(BibliographyListParser, this.genericParse);
    parallelPassageParser = createParser(AnalogueParser, this.genericParse);

    biblAttributeToMatch = AppConfig.evtSettings.edition.externalBibliography.biblAttributeToMatch;
    elemAttributesToMatch = AppConfig.evtSettings.edition.externalBibliography.elementAttributesToMatch;

    public parse(quoteEntry: XMLElement): QuoteEntry {
        return {
            type: QuoteEntry,
            id: getID(quoteEntry),
            attributes: this.attributeParser.parse(quoteEntry),
            text: chainFirstChildTexts(quoteEntry),
            content: parseChildren(quoteEntry, this.genericParse),
            sources: this.getInsideSources(quoteEntry),
            extSources: getExternalSources(quoteEntry, this.elemAttributesToMatch, this.biblAttributeToMatch).map((x) => this.biblParser.parse(x)),
            ref: this.getInsideParallelPassages(quoteEntry),
            class: quoteEntry.tagName.toLowerCase(),
            originalEncoding: getOuterHTML(quoteEntry),
        };
    }

    /**
     * Retrieve and send to parsing all Bibliography elements inside this quote element
     * @param quote XMLElement
     * @returns array of Bibliography Element or a single Bibliography List element
     */
    private getInsideSources(quote: XMLElement): any {
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
    private getInsideParallelPassages(quote: XMLElement): ParallelPassage[]|GenericElement[] {
        const classList = ['ref']; // tutti i ref con type = 'parallelPassage'
        const parallelPassageType = 'parallelPassage';

        return Array.from(quote.children)
            .map((x: XMLElement) => (
                    (classList.includes(x['tagName'])) && (x['attributes'].getNamedItem('type').nodeValue === parallelPassageType)
                ) ? this.parallelPassageParser.parse(x) : null)
            .filter((x) => x);
    }

}
