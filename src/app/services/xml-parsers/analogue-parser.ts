import { AppConfig } from 'src/app/app.config';
import { parse, ParserRegister, xmlParser } from '.';
import { Analogue, AnalogueClass, BibliographicEntry, BibliographicList, GenericElement, Milestone, XMLElement } from '../../models/evt-models';
import { AnchorParser, AttributeParser, GenericElemParser, MilestoneParser } from './basic-parsers';
import { createParser, getID, parseChildren, Parser } from './parser-models';
import { chainFirstChildTexts, getExternalElements, normalizeSpaces } from '../../utils/xml-utils';
import { BibliographyParser } from './bilbliography-parsers';
import { BasicParser } from './quotes-parser';

@xmlParser('evt-analogue-entry-parser', AnalogueParser)
export class AnalogueParser extends BasicParser implements Parser<XMLElement> {

    elementParser = createParser(GenericElemParser, parse);
    attributeParser = createParser(AttributeParser, this.genericParse);
    biblParser = createParser(BibliographyParser, this.genericParse);
    milestoneParser = createParser(MilestoneParser, this.genericParse);
    anchorParser = createParser(AnchorParser, this.genericParse);

    analogueMarker = AppConfig.evtSettings.edition.analogueMarkers;
    biblAttributeToMatch = AppConfig.evtSettings.edition.externalBibliography.biblAttributeToMatch;
    elemAttributesToMatch = AppConfig.evtSettings.edition.externalBibliography.elementAttributesToMatch;
    notDisplayedInTextFlow = ['Note', 'BibliographicList', 'BibliographicEntry', 'BibliographicStructEntry',
    'Analogue', 'MsDesc'];
    evtTextComplexElements = ['choice', 'app', 'l', 'quote', 'p', 'lg'];
    evtInnerTextElements = ['#text', 'reg', 'corr', 'rdg'];

    public parse(analogue: XMLElement): GenericElement|Analogue {

        if (!(this.analogueMarker.includes(analogue.getAttribute('type'))) || (analogue.parentElement.tagName === 'cit')) {
            // no source/target attribute or inside a cit element: not an analogue to display alone
            return this.elementParser.parse(analogue)
        }

        const notableElements = ['div','p','l','lg','note'];
        const sources = this.buildAnalogueSources(analogue);
        const content = parseChildren(analogue, this.genericParse);

        return {
            type: Analogue,
            id: (notableElements.includes(analogue.tagName)) ? 'EVT-ANG:'+getID(analogue) : getID(analogue),
            class: AnalogueClass,
            attributes: this.attributeParser.parse(analogue),
            text: normalizeSpaces(chainFirstChildTexts(analogue, this.evtTextComplexElements, this.evtInnerTextElements)),
            content: content,
            contentToShow: content.filter((x) => !(this.notDisplayedInTextFlow.includes(x['type'].name))),
            sources: sources.sources,
            extSources: sources.extSources,
            extLinkedElements: sources.extLinkedElements,
            quotedElements: this.getQuotedTextFromElements(sources.sources.concat(sources.extSources), sources.extLinkedElements),
            originalEncoding: analogue,
        };
    }

    /**
     * Since elements like ref and seg are not only used for parallel passages,
     * this function checks if the provided element contains an external link to a bibl element
     * and returns that elements or a false
     */
    private buildAnalogueSources(analogue: XMLElement) {
        const selectorsAllowed = 'bibl, bibStruct, listBibl, cit, quote, note, seg, div, l, lg, p, milestone, anchor';
        const elsAllowedForSources = ['bibl','listBibl', 'biblStruct', 'ref', 'cit'];
        const sources = this.getInsideSources(analogue);
        const extElements = getExternalElements(analogue, this.elemAttributesToMatch, this.biblAttributeToMatch, selectorsAllowed);
        const extSources = extElements.map((x) => (elsAllowedForSources.includes(x.tagName)) ? this.biblParser.parse(x) : null).filter((x) => x);
        const parallelPassages = this.selectAndParseParallelElements(extElements);

        return { 'sources': sources, 'extSources': extSources, 'extLinkedElements': parallelPassages };
    }

    /**
     * Retrieve all Bibliography elements *inside* this analogue element
     * @param quote XMLElement
     * @returns array of Bibliography Element or a single Bibliography List element
     */
    private getInsideSources(analogue: XMLElement): BibliographicEntry[] {
        const bibl = ['bibl','listBibl','biblStruct','ref'];

        return Array.from(analogue.children)
            .map((x: XMLElement) => bibl.includes(x['tagName']) ? this.biblParser.parse(x) : null)
            .filter((x) => x);
    }

    /**
     * Gather and send to parse allowed linked parallel passages
     */
    private selectAndParseParallelElements(suspectPPs) {
        const elemParserAssoc = {
            l: ParserRegister.get('l'),
            lg: ParserRegister.get('lg'),
            p: ParserRegister.get('p'),
            div: this.elementParser,
            seg: this.elementParser,
            anchor: this.anchorParser,
            milestone: this.milestoneParser,
            quote: this.elementParser,
            note: this.elementParser,
        }
        const addendum = [];
        const ppElements = suspectPPs.map((x) => (elemParserAssoc[x['tagName']] !== undefined) ? elemParserAssoc[x['tagName']].parse(x) : null)
            .filter((x) => x);
        ppElements.map((x) => (x.type === Milestone) ? addendum.push(x.spanElements) : x );

        return ppElements.concat(addendum.flat());
    }

    private getQuotedTextFromSources(nodes: BibliographicEntry[]): any {
        let quotesInSources = [];
        nodes.forEach((el: BibliographicEntry|BibliographicList) => {
            if (el.type === BibliographicList) {
                quotesInSources = quotesInSources.concat(this.getQuotedTextFromSources(el['sources']));
            } else {
                if (el['quotedText'] !== null) {
                    quotesInSources.push({ id: el.id, quote: el['quotedText'] });
                }
            };
        });

        return quotesInSources;
    }

    private getQuotedTextFromElements(sources: BibliographicEntry[], elements: XMLElement[]): [{id: string, quote: string}] {
        let quotesInSources = this.getQuotedTextFromSources(sources);
        const notDisplayedInText = ['Note','BibliographicList','BibliographicEntry','BibliographicStructEntry','Analogue','MsDesc'];
        elements.forEach((el: XMLElement) => { if (!notDisplayedInText.includes(el['type'])) { quotesInSources.push( { id: el.id, quote: el })} });

        return quotesInSources;
    }

}
