import { xmlParser } from '.';
import { ParallelPassage, XMLElement } from '../../models/evt-models';
import { getOuterHTML } from '../../utils/dom-utils';
import { AttributeParser, BibliographyListParser, BibliographyParser, EmptyParser } from './basic-parsers';
import { createParser, getID, parseChildren, Parser } from './parser-models';

@xmlParser('evt-analogue-entry-parser', AnalogueParser)
export class AnalogueParser extends EmptyParser implements Parser<XMLElement> {

    attributeParser = createParser(AttributeParser, this.genericParse);
    biblParser = createParser(BibliographyParser, this.genericParse);
    listBiblParser = createParser(BibliographyListParser, this.genericParse);

    public parse(quoteEntry: XMLElement): ParallelPassage {
        return {
            type: ParallelPassage,
            id: getID(quoteEntry),
            attributes: this.attributeParser.parse(quoteEntry),
            text: this.chainFirstChildTexts(quoteEntry),
            content: parseChildren(quoteEntry, this.genericParse),
            attrTarget: quoteEntry.getAttribute('target'),
            attrSource: quoteEntry.getAttribute('source'),
            sources: this.getSources(quoteEntry),
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
    private chainFirstChildTexts(n: XMLElement): string {
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
        //get "corresp" e "source" attr

        return Array.from(quote.children)
            .map((x: XMLElement) => bibl.includes(x['tagName']) ? this.biblParser.parse(x) : (
                biblList.includes(x['tagName']) ? this.listBiblParser.parse(x) : null))
            .filter((x) => x);
    }

    //get SEC

    //get REF
    //attr 'target' with referral in external bibliography with corresp xml:id attrb

}
