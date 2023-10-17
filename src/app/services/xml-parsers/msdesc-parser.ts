import { isBoolString } from 'src/app/utils/js-utils';
import { xmlParser } from '.';
import {
    AccMat, Acquisition, Additional, Additions, AdminInfo, AltIdentifier, BibliographicEntry, Binding, BindingDesc, Collation, CollectionEl,
    Condition, CustEvent, CustodialHist, DecoDesc, DecoNote, Depth, Dim, Dimensions, Explicit, Filiation, FinalRubric, Foliation,
    G, HandDesc, HandNote, Head, Height, History, Identifier, Incipit, Institution, Layout, LayoutDesc, Locus, LocusGrp, MaterialValues,
    MsContents, MsDesc, MsFrag, MsIdentifier, MsItem, MsItemStruct, MsName, MsPart, MusicNotation, Note, ObjectDesc, OrigDate,
    Origin, OrigPlace, Paragraph, PhysDesc, Provenance, QuoteEntry, RecordHist, Repository, Rubric, ScriptDesc, Seal, SealDesc, Source, Summary,
    Support, SupportDesc, Surrogates, Text, TypeDesc, TypeNote, Width, XMLElement,
} from '../../models/evt-models';
import { GenericElemParser, queryAndParseElement, queryAndParseElements } from './basic-parsers';
import { GParser } from './character-declarations-parser';
import { createParser, getClass, getDefaultN, getID, parseChildren, Parser, unhandledElement } from './parser-models';
import { BibliographicList } from '../../models/evt-models';

class GAttrParser extends GenericElemParser {
    protected gParser = createParser(GParser, this.genericParse);
}

@xmlParser('dim', DimParser)
export class DimParser extends GAttrParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Dim {
        const genericElem = super.parse(xml);
        const { dimType, scope, extent, unit, quantity, atLeast, atMost, min, max } = genericElem.attributes;

        return {
            ...genericElem,
            type: Dim,
            scope,
            extent,
            unit,
            quantity: quantity ? parseInt(quantity, 10) : undefined,
            atLeast: atLeast ? parseInt(atLeast, 10) : undefined,
            atMost: atMost ? parseInt(atMost, 10) : undefined,
            min: min ? parseInt(min, 10) : undefined,
            max: max ? parseInt(max, 10) : undefined,
            dimType,
            gEl: queryAndParseElements<G>(xml, 'g'),
        };
    }
}

@xmlParser('depth', DepthParser)
export class DepthParser extends GAttrParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Depth {
        const genericElem = super.parse(xml);
        const { scope, extent, unit, quantity, atLeast, atMost, min, max } = genericElem.attributes;

        return {
            ...genericElem,
            type: Depth,
            scope,
            extent,
            unit,
            quantity: quantity ? parseInt(quantity, 10) : undefined,
            atLeast: atLeast ? parseInt(atLeast, 10) : undefined,
            atMost: atMost ? parseInt(atMost, 10) : undefined,
            min: min ? parseInt(min, 10) : undefined,
            max: max ? parseInt(max, 10) : undefined,
            gEl: queryAndParseElements<G>(xml, 'g'),
        };
    }
}

@xmlParser('width', WidthParser)
export class WidthParser extends GAttrParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Width {
        const genericElem = super.parse(xml);
        const { scope, extent, unit, quantity, atLeast, atMost, min, max } = genericElem.attributes;

        return {
            ...genericElem,
            type: Width,
            scope,
            extent,
            unit,
            quantity: quantity ? parseInt(quantity, 10) : undefined,
            atLeast: atLeast ? parseInt(atLeast, 10) : undefined,
            atMost: atMost ? parseInt(atMost, 10) : undefined,
            min: min ? parseInt(min, 10) : undefined,
            max: max ? parseInt(max, 10) : undefined,
            gEl: queryAndParseElements<G>(xml, 'g'),
        };
    }
}

@xmlParser('height', HeightParser)
export class HeightParser extends GAttrParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Height {
        const genericElem = super.parse(xml);
        const { scope, extent, unit, quantity, atLeast, atMost, min, max } = genericElem.attributes;

        return {
            ...genericElem,
            type: Height,
            scope,
            extent,
            unit,
            quantity: quantity ? parseInt(quantity, 10) : undefined,
            atLeast: atLeast ? parseInt(atLeast, 10) : undefined,
            atMost: atMost ? parseInt(atMost, 10) : undefined,
            min: min ? parseInt(min, 10) : undefined,
            max: max ? parseInt(max, 10) : undefined,
            gEl: queryAndParseElements<G>(xml, 'g'),
        };
    }
}

@xmlParser('dimensions', DimensionsParser)
export class DimensionsParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Dimensions {
        const genericElem = super.parse(xml);
        const { dimensionsType, scope, extent, unit, quantity, atLeast, atMost, min, max } = genericElem.attributes;

        return {
            ...genericElem,
            type: Dimensions,
            dimensionsType,
            scope,
            extent,
            unit,
            quantity: quantity ? parseInt(quantity, 10) : undefined,
            atLeast: atLeast ? parseInt(atLeast, 10) : undefined,
            atMost: atMost ? parseInt(atMost, 10) : undefined,
            min: min ? parseInt(min, 10) : undefined,
            max: max ? parseInt(max, 10) : undefined,
            height: queryAndParseElement<Height>(xml, 'height'),
            width: queryAndParseElement<Width>(xml, 'width'),
            depth: queryAndParseElement<Depth>(xml, 'depth'),
            dim: queryAndParseElement<Dim>(xml, 'dim'),
        };
    }
}

@xmlParser('acquisition', AcquisitionParser)
export class AcquisitionParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Acquisition {
        const genericElem = super.parse(xml);
        const { notBefore, notAfter } = genericElem.attributes;

        return {
            ...genericElem,
            type: Acquisition,
            notBefore,
            notAfter,
            name: unhandledElement(xml, 'name', this.genericParse),
        };
    }
}

@xmlParser('origDate', OrigDateParser)
export class OrigDateParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): OrigDate {
        const genericElem = super.parse(xml);
        const { notBefore, notAfter, when, origDateType } = genericElem.attributes;

        return {
            ...genericElem,
            type: OrigDate,
            notBefore,
            notAfter,
            when,
            origDateType,
        };
    }
}

@xmlParser('origPlace', OrigPlaceParser)
export class OrigPlaceParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): OrigPlace {
        const genericElem = super.parse(xml);
        const { key, origPlaceType } = genericElem.attributes;

        return {
            ...genericElem,
            type: OrigPlace,
            key,
            origPlaceType,
        };
    }
}

@xmlParser('origin', OriginParser)
export class OriginParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Origin {
        const genericElem = super.parse(xml);
        const { notBefore, notAfter, evidence, resp } = genericElem.attributes;

        return {
            ...genericElem,
            type: Origin,
            notBefore,
            notAfter,
            evidence,
            resp,
            origDate: queryAndParseElement(xml, 'origDate'),
            origPlace: queryAndParseElement(xml, 'origPlace'),
        };
    }
}

@xmlParser('provenance', ProvenanceParser)
export class ProvenanceParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Provenance {
        const genericElem = super.parse(xml);
        const { when } = genericElem.attributes;

        return {
            ...genericElem,
            type: Acquisition,
            when,
        };
    }
}

@xmlParser('history', HistoryParser)
export class HistoryParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): History {

        return {
            ...super.parse(xml),
            type: History,
            acquisition: queryAndParseElement(xml, 'acquisition'),
            origin: queryAndParseElement(xml, 'origin'),
            provenance: queryAndParseElements(xml, 'provenance'),
            summary: queryAndParseElement(xml, 'summary'),
            pEl: queryAndParseElements<Paragraph>(xml, 'p'),
        };
    }
}

@xmlParser('layout', LayoutParser)
export class LayoutParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Layout {
        const genericElem = super.parse(xml);
        const { columns, streams, ruledLines, writtenLines } = genericElem.attributes;

        return {
            ...genericElem,
            type: LayoutDesc,
            columns: columns ? parseInt(columns, 10) : undefined,
            streams: streams ? parseInt(streams, 10) : undefined,
            ruledLines: ruledLines ? parseInt(ruledLines, 10) : undefined,
            writtenLines: writtenLines ? parseInt(writtenLines, 10) : undefined,
            pEl: queryAndParseElements<Paragraph>(xml, 'p'),
        };
    }
}

@xmlParser('layoutDesc', LayoutDescParser)
export class LayoutDescParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): LayoutDesc {

        return {
            ...super.parse(xml),
            type: LayoutDesc,
            pEl: queryAndParseElements<Paragraph>(xml, 'p'),
            ab: unhandledElement(xml, 'ab', this.genericParse),
            summary: queryAndParseElement(xml, 'provenance'),
            layout: queryAndParseElement(xml, 'layout'),
        };
    }
}

@xmlParser('support', SupportParser)
export class SupportParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Support {

        return {
            ...super.parse(xml),
            type: Support,
            material: unhandledElement(xml, 'material', this.genericParse),
            watermark: unhandledElement(xml, 'watermark', this.genericParse),
        };
    }
}

@xmlParser('collation', CollationParser)
export class CollationParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Collation {

        return {
            ...super.parse(xml),
            type: Collation,
            pEl: queryAndParseElements(xml, 'p'),
        };
    }
}

@xmlParser('condition', ConditionParser)
export class ConditionParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Condition {

        return {
            ...super.parse(xml),
            type: Condition,
            pEl: queryAndParseElements(xml, 'p'),
        };
    }
}

@xmlParser('foliation', FoliationParser)
export class FoliationParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Foliation {

        return {
            ...super.parse(xml),
            type: Foliation,
            id: getID(xml),
            pEl: queryAndParseElements(xml, 'p'),
        };
    }
}

@xmlParser('supportDesc', SupportDescParser)
export class SupportDescParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): SupportDesc {

        return {
            ...super.parse(xml),
            type: SupportDesc,
            material: xml.getAttribute('material') as MaterialValues,
            pEl: queryAndParseElements(xml, 'p'),
            ab: unhandledElement(xml, 'ab', this.genericParse),
            extents: unhandledElement(xml, 'extent', this.genericParse),
            support: queryAndParseElement(xml, 'support'),
            collation: queryAndParseElement(xml, 'collation'),
            foliation: queryAndParseElement(xml, 'foliation'),
            condition: queryAndParseElement(xml, 'condition'),
        };
    }
}

@xmlParser('objectDesc', ObjectDescParser)
export class ObjectDescParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): ObjectDesc {
        const genericElem = super.parse(xml);
        const { form } = genericElem.attributes;

        return {
            ...genericElem,
            type: ObjectDesc,
            form,
            layoutDesc: queryAndParseElement(xml, 'layoutDesc'),
            supportDesc: queryAndParseElement(xml, 'supportDesc'),
            pEl: queryAndParseElements(xml, 'p'),
        };
    }
}

@xmlParser('decoNote', DecoNoteParser)
export class DecoNoteParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): DecoNote {
        const genericElem = super.parse(xml);
        const { decoNoteType } = genericElem.attributes;

        return {
            ...genericElem,
            type: DecoNote,
            decoNoteType,
            watermark: unhandledElement(xml, 'watermark', this.genericParse),
        };
    }
}

@xmlParser('binding', BindingParser)
export class BindingParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Binding {

        return {
            ...super.parse(xml),
            type: Binding,
            contemporary: true || false,
            decoNote: queryAndParseElements(xml, 'decoNote'),
            pEl: queryAndParseElements(xml, 'p'),
            condition: unhandledElement(xml, 'condition', this.genericParse),
            ab: unhandledElement(xml, 'ab', this.genericParse),
        };
    }
}

@xmlParser('bindingDesc', BindingDescParser)
export class BindingDescParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): BindingDesc {

        return {
            ...super.parse(xml),
            type: BindingDesc,
            condition: unhandledElement(xml, 'condition', this.genericParse),
            decoNote: queryAndParseElements(xml, 'decoNote'),
            binding: queryAndParseElements(xml, 'binding'),
            pEl: queryAndParseElements(xml, 'p'),
        };
    }
}

@xmlParser('summary', SummaryParser)
export class SummaryParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Summary {

        return {
            ...super.parse(xml),
            type: Summary,
            pEl: queryAndParseElements(xml, 'p'),
        };
    }
}

@xmlParser('decoDesc', DecoDescParser)
export class DecoDescParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): DecoDesc {

        return {
            ...super.parse(xml),
            type: DecoDesc,
            decoNote: queryAndParseElement(xml, 'decoNote'),
            pEl: queryAndParseElements(xml, 'p'),
            summary: queryAndParseElement(xml, 'summary'),
            ab: unhandledElement(xml, 'ab', this.genericParse),
        };
    }
}

@xmlParser('handDesc', HandDescParser)
export class HandDescParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): HandDesc {
        const genericElem = super.parse(xml);
        const { hands } = genericElem.attributes;

        return {
            ...genericElem,
            type: HandDesc,
            hands,
            handNote: queryAndParseElements<HandNote>(xml, 'handNote'),
        };
    }
}

@xmlParser('additions', AdditionsParser)
export class AdditionsParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Additions {

        return {
            ...super.parse(xml),
            type: Additions,
            pEl: queryAndParseElements(xml, 'p'),
        };
    }
}

@xmlParser('scriptDesc', ScriptDescParser)
export class ScriptDescParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): ScriptDesc {

        return {
            ...super.parse(xml),
            type: ScriptDesc,
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            summary: queryAndParseElement(xml, 'summary'),
            scriptNote: unhandledElement(xml, 'scriptNote', this.genericParse),
        };
    }
}

@xmlParser('seal', SealParser)
export class SealParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Seal {
        const genericElem = super.parse(xml);
        const { n, sealType } = genericElem.attributes;

        return {
            ...genericElem,
            type: Seal,
            contemporary: isBoolString(xml.getAttribute('contemporary')),
            decoNote: queryAndParseElement(xml, 'decoNote'),
            sealType,
            n: getDefaultN(n),
            pEl: queryAndParseElements(xml, 'p'),
            ab: unhandledElement(xml, 'ab', this.genericParse),
        };
    }
}

@xmlParser('sealDesc', SealDescParser)
export class SealDescParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): SealDesc {

        return {
            ...super.parse(xml),
            type: SealDesc,
            seal: queryAndParseElement(xml, 'seal'),
        };
    }
}

@xmlParser('typeNote', TypeNoteParser)
export class TypeNoteParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): TypeNote {
        const genericElem = super.parse(xml);
        const { scope } = genericElem.attributes;

        return {
            ...genericElem,
            type: TypeNote,
            id: getID(xml),
            scope,
        };
    }
}

@xmlParser('typeDesc', TypeDescParser)
export class TypeDescParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): TypeDesc {

        return {
            ...super.parse(xml),
            type: TypeDesc,
            summary: queryAndParseElement(xml, 'summary'),
            typeNote: queryAndParseElement(xml, 'typeNote'),
        };
    }
}

@xmlParser('accMat', AccMatParser)
export class AccMatParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): AccMat {

        return {
            ...super.parse(xml),
            type: AccMat,
            pEl: queryAndParseElements(xml, 'p'),
        };
    }
}

@xmlParser('musicNotation', MusicNotationParser)
export class MusicNotationParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): MusicNotation {

        return {
            ...super.parse(xml),
            type: MusicNotation,
            term: unhandledElement(xml, 'term', this.genericParse),
        };
    }
}

@xmlParser('physDesc', PhysDescParser)
export class PhysDescParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): PhysDesc {

        return {
            ...super.parse(xml),
            type: PhysDesc,
            objectDesc: queryAndParseElement(xml, 'objectDesc'),
            bindingDesc: queryAndParseElement(xml, 'bindingDesc'),
            decoDesc: queryAndParseElement(xml, 'decoDesc'),
            handDesc: queryAndParseElement(xml, 'handDesc'),
            accMat: queryAndParseElement(xml, 'accMat'),
            additions: queryAndParseElement(xml, 'additions'),
            musicNotation: queryAndParseElement(xml, 'musicNotation'),
            scriptDesc: queryAndParseElement(xml, 'scriptDesc'),
            sealDesc: queryAndParseElement(xml, 'sealDesc'),
            typeDesc: queryAndParseElement(xml, 'typeDesc'),
            pEl: queryAndParseElements<Paragraph>(xml, 'p'),
        };
    }
}

@xmlParser('finalRubric', FinalRubricParser)
export class FinalRubricParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): FinalRubric {

        return {
            ...super.parse(xml),
            type: FinalRubric,
            lbEl: queryAndParseElements(xml, 'lb'),
        };
    }
}

@xmlParser('locus', LocusParser)
export class LocusParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Locus {
        const genericElem = super.parse(xml);
        const { scheme, from, to, facs, target } = genericElem.attributes;

        return {
            ...genericElem,
            type: Locus,
            scheme,
            from,
            to,
            facs,
            target,
            gEl: queryAndParseElements(xml, 'g'),
            locus: queryAndParseElement(xml, 'locus'),
            hi: unhandledElement(xml, 'hi', this.genericParse),
        };
    }
}

@xmlParser('locusGrp', LocusGrpParser)
export class LocusGrpParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): LocusGrp {
        const genericElem = super.parse(xml);
        const { scheme } = genericElem.attributes;

        return {
            ...genericElem,
            type: LocusGrp,
            scheme,
            locus: queryAndParseElement(xml, 'locus'),
        };
    }
}

@xmlParser('incipit', IncipitParser)
export class IncipitParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Incipit {
        const genericElem = super.parse(xml);
        const { lang } = genericElem.attributes;

        return {
            ...genericElem,
            type: Incipit,
            defective: isBoolString(xml.getAttribute('defective')),
            lang,
            lbEl: queryAndParseElements(xml, 'lb'),
            locus: queryAndParseElement(xml, 'locus'),
        };
    }
}

@xmlParser('explicit', ExplicitParser)
export class ExplicitParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Explicit {
        const genericElem = super.parse(xml);
        const { lang } = genericElem.attributes;

        return {
            ...genericElem,
            type: Explicit,
            defective: isBoolString(xml.getAttribute('defective')),
            lang,
            locus: queryAndParseElement(xml, 'locus'),
        };
    }
}

@xmlParser('rubric', RubricParser)
export class RubricParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Rubric {
        const genericElem = super.parse(xml);
        const { lang, rend } = genericElem.attributes;

        return {
            ...genericElem,
            type: Rubric,
            lang,
            rend,
            lbEl: queryAndParseElements(xml, 'lb'),
            locus: queryAndParseElement(xml, 'locus'),
            stamp: unhandledElement(xml, 'stamp', this.genericParse),
        };
    }
}

@xmlParser('filiation', FiliationParser)
export class FiliationParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Filiation {
        const genericElem = super.parse(xml);
        const { filiationType } = genericElem.attributes;

        return {
            ...genericElem,
            type: Filiation,
            filiationType,
        };
    }
}

@xmlParser('msItemStruct', MsItemStructParser)
export class MsItemStructParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): MsItemStruct {
        const genericElem = super.parse(xml);
        const { n } = genericElem.attributes;

        return {
            ...genericElem,
            type: MsItemStruct,
            n: getDefaultN(n),
            defective: isBoolString(xml.getAttribute('defective')),
            authors: unhandledElement(xml, 'author', this.genericParse),
            titles: unhandledElement(xml, 'title', this.genericParse),
            textLangs: unhandledElement(xml, 'textLang', this.genericParse),
            bibl: queryAndParseElement<BibliographicEntry>(xml, 'bibl'),
            respStmt: unhandledElement(xml, 'respStmt', this.genericParse),
            quote: queryAndParseElement<QuoteEntry>(xml, 'quote'),
            listBibl: queryAndParseElement<BibliographicList>(xml, 'listBibl'),
            colophons: unhandledElement(xml, 'colophon', this.genericParse),
            rubric: queryAndParseElement<Rubric>(xml, 'rubric'),
            incipit: queryAndParseElement<Incipit>(xml, 'incipit'),
            explicit: queryAndParseElement<Explicit>(xml, 'explicit'),
            finalRubric: queryAndParseElement<FinalRubric>(xml, 'finalRubric'),
            decoNote: queryAndParseElement<DecoNote>(xml, 'decoNote'),
            filiation: queryAndParseElements<Filiation>(xml, 'filiation'),
            locus: queryAndParseElement<Locus>(xml, 'locus'),
            noteEl: queryAndParseElements<Note>(xml, 'note'),
        };
    }
}

@xmlParser('msItem', MsItemParser)
export class MsItemParser extends MsItemStructParser implements Parser<XMLElement> {
    parse(xml: XMLElement): MsItem {

        return {
            ...super.parse(xml),
            type: MsItem,
            docAuthors: unhandledElement(xml, 'docAuthor', this.genericParse),
            docTitles: unhandledElement(xml, 'docTitle', this.genericParse),
            docImprints: unhandledElement(xml, 'docImprint', this.genericParse),
            docDate: unhandledElement(xml, 'docDate', this.genericParse),
            locusGrp: queryAndParseElement<LocusGrp>(xml, 'locusGrp'),
            gapEl: queryAndParseElements(xml, 'gap'),
            msItem: queryAndParseElements(xml, 'msItem'),
        };
    }
}

@xmlParser('custEvent', CustEventParser)
export class CustEventParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): CustEvent {
        const genericElem = super.parse(xml);
        const { notBefore, notAfter, when, from, to, custEventType } = genericElem.attributes;

        return {
            ...super.parse(xml),
            type: CustEvent,
            notBefore,
            notAfter,
            when,
            from,
            to,
            custEventType,
        };
    }
}

@xmlParser('custodialHist', CustodialHistParser)
export class CustodialHistParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): CustodialHist {

        return {
            ...super.parse(xml),
            type: CustodialHist,
            custEvent: queryAndParseElements(xml, 'custEvent'),
            ab: unhandledElement(xml, 'ab', this.genericParse),
            pEl: queryAndParseElements<Paragraph>(xml, 'p'),
        };
    }
}

@xmlParser('source', SourceParser)
export class SourceParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Source {

        return {
            ...super.parse(xml),
            type: Source,
            pEl: queryAndParseElements<Paragraph>(xml, 'p'),
        };
    }
}

@xmlParser('recordHist', RecordHistParser)
export class RecordHistParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): RecordHist {

        return {
            ...super.parse(xml),
            type: RecordHist,
            changes: unhandledElement(xml, 'change', this.genericParse),
            source: queryAndParseElements(xml, 'source'),
            ab: unhandledElement(xml, 'ab', this.genericParse),
            pEl: queryAndParseElements<Paragraph>(xml, 'p'),
        };
    }
}

@xmlParser('adminInfo', AdminInfoParser)
export class AdminInfoParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): AdminInfo {

        return {
            ...super.parse(xml),
            type: AdminInfo,
            noteEl: queryAndParseElements(xml, 'note'),
            availabilities: unhandledElement(xml, 'availability', this.genericParse),
            custodialHist: queryAndParseElement(xml, 'custodialHist'),
            recordHist: queryAndParseElement(xml, 'recordHist'),
        };
    }
}

@xmlParser('surrogates', SurrogatesParser)
export class SurrogatesParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Surrogates {

        return {
            ...super.parse(xml),
            type: Surrogates,
            bibls: unhandledElement(xml, 'bibl', this.genericParse),
            pEl: queryAndParseElements<Paragraph>(xml, 'p'),
        };
    }
}

@xmlParser('additional', AdditionalParser)
export class AdditionalParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Additional {

        return {
            ...super.parse(xml),
            type: Summary,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            listBibls: unhandledElement(xml, 'listBibl', this.genericParse),
            adminInfo: queryAndParseElement(xml, 'adminInfo'),
            surrogates: queryAndParseElement(xml, 'surrogates'),
        };
    }
}

@xmlParser('repository', RepositoryParser)
export class RepositoryParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Repository {
        const genericElem = super.parse(xml);
        const { lang } = genericElem.attributes;

        return {
            ...genericElem,
            type: Repository,
            lang,
        };
    }
}

@xmlParser('msContents', MsContentsParser)
export class MsContentsParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): MsContents {

        return {
            ...super.parse(xml),
            type: MsContents,
            summary: queryAndParseElement(xml, 'summary'),
            msItem: queryAndParseElements(xml, 'msItem'),
            msItemStruct: queryAndParseElement(xml, 'msItemStruct'),
            pEl: queryAndParseElements<Paragraph>(xml, 'p'),
            textLangs: unhandledElement(xml, 'textLang', this.genericParse),
        };
    }
}

@xmlParser('collection', CollectionParser)
export class CollectionParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): CollectionEl {
        const genericElem = super.parse(xml);
        const { collectionType } = genericElem.attributes;

        return {
            ...genericElem,
            type: CollectionEl,
            collectionType,
        };
    }
}

@xmlParser('evt-identifier-parser', IdentifierParser)
export class IdentifierParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Identifier {
        return {
            ...super.parse(xml),
            type: Identifier,
            collection: queryAndParseElements(xml, 'collection'),
            repository: queryAndParseElement(xml, 'repository'),
            idnos: unhandledElement(xml, 'idno', this.genericParse),
            regions: unhandledElement(xml, 'region', this.genericParse),
            settlements: unhandledElement(xml, 'settlement', this.genericParse),
            countries: unhandledElement(xml, 'country', this.genericParse),
        };
    }
}

@xmlParser('altIdentifier', AltIdentifierParser)
export class AltIdentifierParser extends IdentifierParser implements Parser<XMLElement> {
    parse(xml: XMLElement): AltIdentifier {

        return {
            ...super.parse(xml),
            type: AltIdentifier,
            noteEl: queryAndParseElements(xml, 'note'),
        };
    }
}

@xmlParser('msName', MsNameParser)
export class MsNameParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): MsName {

        return {
            ...super.parse(xml),
            type: AltIdentifier,
            name: unhandledElement(xml, 'name', this.genericParse),
            rs: unhandledElement(xml, 'rs', this.genericParse),
            gEl: queryAndParseElements(xml, 'g'),
        };
    }
}

@xmlParser('institution', InstitutionParser)
export class InstitutionParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Institution {

        return {
            ...super.parse(xml),
            type: Institution,
            country: unhandledElement(xml, 'country', this.genericParse),
            region: unhandledElement(xml, 'region', this.genericParse),
        };
    }
}

@xmlParser('msIdentifier', MsIdentifierParser)
export class MsIdentifierParser extends IdentifierParser implements Parser<XMLElement> {
    parse(xml: XMLElement): MsIdentifier {

        return {
            ...super.parse(xml),
            type: MsIdentifier,
            id: getID(xml),
            institution: queryAndParseElement(xml, 'institution'),
            altIdentifier: queryAndParseElements(xml, 'altIdentifier'),
            msName: queryAndParseElements(xml, 'msName'),
        };
    }
}

@xmlParser('head', HeadParser)
export class HeadParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Head {
        const genericElem = super.parse(xml);
        const { place, rend, style, rendition, facs, n } = genericElem.attributes;

        return {
            ...genericElem,
            type: Head,
            n: getDefaultN(n),
            place,
            rend,
            rendition,
            style,
            facs,
            lbEl: queryAndParseElements(xml, 'lb'),
            hi: unhandledElement(xml, 'hi', this.genericParse),
            title: unhandledElement(xml, 'title', this.genericParse),
            origPlace: queryAndParseElement(xml, 'origPlace'),
            origDate: queryAndParseElement(xml, 'origDate'),
        };
    }
}

@xmlParser('msFrag', MsFragParser)
export class MsFragParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): MsFrag {

        return {
            ...super.parse(xml),
            type: MsFrag,
            additional: queryAndParseElement(xml, 'additional'),
            altIdentifier: queryAndParseElement(xml, 'altIdentifier'),
            history: queryAndParseElement(xml, 'history'),
            msContents: queryAndParseElement(xml, 'msContents'),
            msIdentifier: queryAndParseElement(xml, 'msIdentifier'),
            physDesc: queryAndParseElement(xml, 'physDesc'),
            pEl: queryAndParseElements<Paragraph>(xml, 'p'),

        };
    }
}

@xmlParser('msPart', MsPartParser)
export class MsPartParser extends MsFragParser implements Parser<XMLElement> {
    parse(xml: XMLElement): MsPart {

        return {
            ...super.parse(xml),
            type: MsPart,
            msParts: queryAndParseElements(xml, 'msPart'),
            head: queryAndParseElement(xml, 'head'),
        };
    }
}

@xmlParser('msDesc', MsDescParser)
export class MsDescParser extends MsPartParser implements Parser<XMLElement> {
    private msDescCounter = 0;
    parse(xml: XMLElement): MsDesc {
        const genericElem = super.parse(xml);
        const { n, label } = genericElem.attributes;
        let firstIdnoValue = '';

        const msDesc: MsDesc = {
            ...super.parse(xml),
            type: MsDesc,
            id: getID(xml),
            n: getDefaultN(n),
            label,
            msFrags: queryAndParseElements(xml, 'msFrag'),
        };
        firstIdnoValue = this.getFirstIdnoValue(msDesc);
        msDesc.label = xml.getAttribute('n') || xml.getAttribute('xml:id') || firstIdnoValue;

        return msDesc;
    }

    getFirstIdnoValue(ms) {
        this.msDescCounter++;
        if (ms.msIdentifier.idnos.length > 0) {
            const item = ms.msIdentifier.idnos[0].filter((el: Text) => el.text?.trim() || el.content?.length > 0);
            if (item[0].text) {
                return item[0].text.trim();
            }

            if (item[0].content.length > 0){
                return (item[0].content[0].text);
            }
        }

        return `MS Desc ${this.msDescCounter}`;
    }
}
