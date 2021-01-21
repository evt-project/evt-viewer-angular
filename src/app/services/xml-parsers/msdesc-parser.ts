import { flat } from 'src/app/utils/js-utils';
import {
    AccMat, Acquisition, Additional, Additions, AdminInfo, AltIdentifier, Binding, BindingDesc, Collation, CollectionEl, Condition,
    CustEvent, CustodialHist, DecoDesc, DecoNote, Depth, Dim, Dimensions, Explicit, Filiation, FinalRubric, Foliation,
    G,
    HandDesc, Head, Height, History, Identifier, Incipit, Institution, Layout, LayoutDesc, Locus, LocusGrp, MaterialValues, MsContents,
    MsDesc, MsFrag, MsIdentifier, MsItem, MsItemStruct, MsName, MsPart, MusicNotation, Note, ObjectDesc, OrigDate,
    Origin, OrigPlace, Paragraph, PhysDesc, Provenance, RecordHist, Repository, Rubric, ScriptDesc, Seal, SealDesc, Source, Summary,
    Support, SupportDesc, Surrogates, TypeDesc, TypeNote, Width, XMLElement,
} from '../../models/evt-models';
import { GapParser, GenericElemParser, LBParser, NoteParser, ParagraphParser, queryAndParseElement, queryAndParseElements } from './basic-parsers';
import { GParser } from './character-declarations-parser';
import { createParser, getClass, getDefaultN, getID, parseChildren, Parser } from './parser-models';

function unhandledElement(xml: XMLElement, name: string) {
    return flat(Array.from(xml.querySelectorAll<XMLElement>(`:scope > ${name}`)).map(e => parseChildren(e, this.genericParse)));
}

class GAttrParser extends GenericElemParser {
    protected gParser = createParser(GParser, this.genericParse);
}

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
            gEl: queryAndParseElements<G>(xml, 'g', this.gParser),
        };
    }
}

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
            gEl: queryAndParseElements<G>(xml, 'g', this.gParser),
        };
    }
}

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
            gEl: queryAndParseElements<G>(xml, 'g', this.gParser),
        };
    }
}

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
            gEl: queryAndParseElements<G>(xml, 'g', this.gParser),
        };
    }
}

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
            height: queryAndParseElement<Height>(xml, 'height', createParser(HeightParser, this.genericParse)),
            width: queryAndParseElement<Width>(xml, 'width', createParser(WidthParser, this.genericParse)),
            depth: queryAndParseElement<Depth>(xml, 'depth', createParser(DepthParser, this.genericParse)),
            dim: queryAndParseElement<Dim>(xml, 'dim', createParser(DimParser, this.genericParse)),
        };
    }
}

export class AcquisitionParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Acquisition {
        const genericElem = super.parse(xml);
        const { notBefore, notAfter } = genericElem.attributes;

        return {
            ...genericElem,
            type: Acquisition,
            notBefore,
            notAfter,
            name: unhandledElement(xml, 'name'),
        };
    }
}

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
            origDate: queryAndParseElement(xml, 'origDate', createParser(OrigDateParser, this.genericParse)),
            origPlace: queryAndParseElement(xml, 'origPlace', createParser(OrigPlaceParser, this.genericParse)),
        };
    }
}

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

export class HistoryParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): History {

        return {
            ...super.parse(xml),
            type: History,
            acquisition: queryAndParseElement(xml, 'acquisition', createParser(AcquisitionParser, this.genericParse)),
            origin: queryAndParseElement(xml, 'origin', createParser(OriginParser, this.genericParse)),
            provenance: queryAndParseElement(xml, 'provenance', createParser(ProvenanceParser, this.genericParse)),
            summary: queryAndParseElement(xml, 'provenance', createParser(ProvenanceParser, this.genericParse)),
        };
    }
}

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
            pEl: queryAndParseElements<Paragraph>(xml, 'p', createParser(ParagraphParser, this.genericParse)),
        };
    }
}

export class LayoutDescParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): LayoutDesc {

        return {
            ...super.parse(xml),
            type: LayoutDesc,
            structuredData: Array.from(xml.querySelectorAll(':scope > p')).length === 0,
            pEl: queryAndParseElements<Paragraph>(xml, 'p', createParser(ParagraphParser, this.genericParse)),
            ab: unhandledElement(xml, 'ab'),
            summary: queryAndParseElement(xml, 'provenance', createParser(ProvenanceParser, this.genericParse)),
            layout: queryAndParseElement(xml, 'layout', createParser(ProvenanceParser, this.genericParse)),
        };
    }
}

export class SupportParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Support {

        return {
            ...super.parse(xml),
            type: Support,
            material: unhandledElement(xml, 'material'),
            watermark: unhandledElement(xml, 'watermark'),
        };
    }
}

export class CollationParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Collation {

        return {
            ...super.parse(xml),
            type: Collation,
            pEl: queryAndParseElements(xml, 'p', createParser(ParagraphParser, this.genericParse)),
        };
    }
}

export class ConditionParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Condition {

        return {
            ...super.parse(xml),
            type: Condition,
            pEl: queryAndParseElements(xml, 'p', createParser(ParagraphParser, this.genericParse)),
        };
    }
}

export class FoliationParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Foliation {

        return {
            ...super.parse(xml),
            type: Foliation,
            id: getID(xml),
            pEl: queryAndParseElements(xml, 'p', createParser(ParagraphParser, this.genericParse)),
        };
    }
}

export class SupportDescParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): SupportDesc {

        return {
            ...super.parse(xml),
            type: SupportDesc,
            material: xml.getAttribute('material') as MaterialValues,
            pEl: queryAndParseElements(xml, 'p', createParser(ParagraphParser, this.genericParse)),
            ab: unhandledElement(xml, 'ab'),
            extent: unhandledElement(xml, 'extent'),
            support: queryAndParseElement(xml, 'support', createParser(SupportParser, this.genericParse)),
            collation: queryAndParseElement(xml, 'collation', createParser(CollationParser, this.genericParse)),
            foliation: queryAndParseElement(xml, 'foliation', createParser(FoliationParser, this.genericParse)),
            condition: queryAndParseElement(xml, 'condition', createParser(ConditionParser, this.genericParse)),
        };
    }
}

export class ObjectDescParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): ObjectDesc {
        const genericElem = super.parse(xml);
        const { form } = genericElem.attributes;

        return {
            ...genericElem,
            type: ObjectDesc,
            form,
            layoutDesc: queryAndParseElement(xml, 'layoutDesc', createParser(LayoutDescParser, this.genericParse)),
            supportDesc: queryAndParseElement(xml, 'supportDesc', createParser(SupportDescParser, this.genericParse)),
        };
    }
}

export class DecoNoteParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): DecoNote {
        const genericElem = super.parse(xml);
        const { decoNoteType } = genericElem.attributes;

        return {
            ...genericElem,
            type: DecoNote,
            decoNoteType,
            watermark: unhandledElement(xml, 'watermark'),
        };
    }
}

export class BindingParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Binding {

        return {
            ...super.parse(xml),
            type: Binding,
            contemporary: true || false,
            decoNote: queryAndParseElement(xml, 'decoNote', createParser(DecoNoteParser, this.genericParse)),
            pEl: queryAndParseElements(xml, 'p', createParser(ParagraphParser, this.genericParse)),
            condition: unhandledElement(xml, 'condition'),
            ab: unhandledElement(xml, 'ab'),
        };
    }
}

export class BindingDescParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): BindingDesc {

        return {
            ...super.parse(xml),
            type: BindingDesc,
            condition: unhandledElement(xml, 'condition'),
            decoNote: queryAndParseElement(xml, 'decoNote', createParser(DecoNoteParser, this.genericParse)),
            binding: queryAndParseElement(xml, 'binding', createParser(BindingParser, this.genericParse)),
        };
    }
}

export class SummaryParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Summary {

        return {
            ...super.parse(xml),
            type: Summary,
            pEl: queryAndParseElements(xml, 'p', createParser(ParagraphParser, this.genericParse)),
        };
    }
}

export class DecoDescParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): DecoDesc {

        return {
            ...super.parse(xml),
            type: DecoDesc,
            decoNote: queryAndParseElement(xml, 'decoNote', createParser(DecoNoteParser, this.genericParse)),
            pEl: queryAndParseElements(xml, 'p', createParser(ParagraphParser, this.genericParse)),
            summary: queryAndParseElement(xml, 'summary', createParser(SummaryParser, this.genericParse)),
            ab: unhandledElement(xml, 'ab'),
        };
    }
}

export class HandDescParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): HandDesc {
        const genericElem = super.parse(xml);
        const { hands } = genericElem.attributes;

        return {
            ...genericElem,
            type: HandDesc,
            hands,
            handNote: unhandledElement(xml, 'handNote'),
        };
    }
}

export class AdditionsParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Additions {

        return {
            ...super.parse(xml),
            type: Additions,
            pEl: queryAndParseElements(xml, 'p', createParser(ParagraphParser, this.genericParse)),
        };
    }
}

export class ScriptDescParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): ScriptDesc {

        return {
            ...super.parse(xml),
            type: ScriptDesc,
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            summary: queryAndParseElement(xml, 'summary', createParser(SummaryParser, this.genericParse)),
            scriptNote: unhandledElement(xml, 'scriptNote'),
        };
    }
}

export class SealParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Seal {
        const genericElem = super.parse(xml);
        const { n, sealType } = genericElem.attributes;

        return {
            ...genericElem,
            type: Seal,
            contemporary: true || false, // FIXME: this evaluates always to true!
            decoNote: queryAndParseElement(xml, 'decoNote', createParser(DecoNoteParser, this.genericParse)),
            sealType,
            n: getDefaultN(n),
            pEl: queryAndParseElements(xml, 'p', createParser(ParagraphParser, this.genericParse)),
            ab: unhandledElement(xml, 'ab'),
        };
    }
}

export class SealDescParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): SealDesc {

        return {
            ...super.parse(xml),
            type: SealDesc,
            seal: queryAndParseElement(xml, 'seal', createParser(SealParser, this.genericParse)),
        };
    }
}

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

export class TypeDescParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): TypeDesc {

        return {
            ...super.parse(xml),
            type: TypeDesc,
            summary: queryAndParseElement(xml, 'summary', createParser(SummaryParser, this.genericParse)),
            typeNote: queryAndParseElement(xml, 'typeNote', createParser(TypeNoteParser, this.genericParse)),
        };
    }
}

export class AccMatParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): AccMat {

        return {
            ...super.parse(xml),
            type: AccMat,
            pEl: queryAndParseElements(xml, 'p', createParser(ParagraphParser, this.genericParse)),
        };
    }
}

export class MusicNotationParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): MusicNotation {

        return {
            ...super.parse(xml),
            type: MusicNotation,
            term: unhandledElement(xml, 'term'),
        };
    }
}

export class PhysDescParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): PhysDesc {

        return {
            ...super.parse(xml),
            type: PhysDesc,
            structuredData: Array.from(xml.querySelectorAll(':scope > p')).length === 0,
            objectDesc: queryAndParseElement(xml, 'objectDesc', createParser(ObjectDescParser, this.genericParse)),
            bindingDesc: queryAndParseElement(xml, 'bindingDesc', createParser(BindingDescParser, this.genericParse)),
            decoDesc: queryAndParseElement(xml, 'decoDesc', createParser(DecoDescParser, this.genericParse)),
            handDesc: queryAndParseElement(xml, 'handDesc', createParser(HandDescParser, this.genericParse)),
            accMat: queryAndParseElement(xml, 'accMat', createParser(AccMatParser, this.genericParse)),
            additions: queryAndParseElement(xml, 'additions', createParser(AdditionsParser, this.genericParse)),
            musicNotation: queryAndParseElement(xml, 'musicNotation', createParser(MusicNotationParser, this.genericParse)),
            scriptDesc: queryAndParseElement(xml, 'scriptDesc', createParser(ScriptDescParser, this.genericParse)),
            sealDesc: queryAndParseElement(xml, 'sealDesc', createParser(SealDescParser, this.genericParse)),
            typeDesc: queryAndParseElement(xml, 'typeDesc', createParser(TypeDescParser, this.genericParse)),
        };
    }
}

export class FinalRubricParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): FinalRubric {

        return {
            ...super.parse(xml),
            type: FinalRubric,
            lbEl: queryAndParseElements(xml, 'lb', createParser(LBParser, this.genericParse)),
        };
    }
}

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
            gEl: queryAndParseElements(xml, 'g', createParser(GParser, this.genericParse)),
            locus: queryAndParseElement(xml, 'locus', createParser(LocusParser, this.genericParse)),
            hi: unhandledElement(xml, 'hi'),
        };
    }
}

export class LocusGrpParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): LocusGrp {
        const genericElem = super.parse(xml);
        const { scheme } = genericElem.attributes;

        return {
            ...genericElem,
            type: LocusGrp,
            scheme,
            locus: queryAndParseElement(xml, 'locus', createParser(LocusParser, this.genericParse)),
        };
    }
}

export class IncipitParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Incipit {
        const genericElem = super.parse(xml);
        const { lang } = genericElem.attributes;

        return {
            ...genericElem,
            type: Incipit,
            defective: true || false, // FIXME: this always evaluates to true!
            lang,
            lbEl: queryAndParseElements(xml, 'lb', createParser(LBParser, this.genericParse)),
            locus: queryAndParseElement(xml, 'locus', createParser(LocusParser, this.genericParse)),
        };
    }
}

export class ExplicitParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Explicit {
        const genericElem = super.parse(xml);
        const { lang } = genericElem.attributes;

        return {
            ...genericElem,
            type: Explicit,
            defective: true || false, // FIXME: this always evaluates to true!
            lang,
            locus: queryAndParseElement(xml, 'locus', createParser(LocusParser, this.genericParse)),
        };
    }
}

export class RubricParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Rubric {
        const genericElem = super.parse(xml);
        const { lang, rend } = genericElem.attributes;

        return {
            ...genericElem,
            type: Rubric,
            lang,
            rend,
            lbEl: queryAndParseElements(xml, 'lb', createParser(LBParser, this.genericParse)),
            locus: queryAndParseElement(xml, 'locus', createParser(LocusParser, this.genericParse)),
            stamp: unhandledElement(xml, 'stamp'),
        };
    }
}

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

export class MsItemStructParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): MsItemStruct {
        const genericElem = super.parse(xml);
        const { n } = genericElem.attributes;

        return {
            ...genericElem,
            type: MsItemStruct,
            n: getDefaultN(n),
            defective: true || false, // FIXME always true
            author: unhandledElement(xml, 'author'),
            title: unhandledElement(xml, 'title'),
            textLang: unhandledElement(xml, 'textLang'),
            bibl: unhandledElement(xml, 'bibl'),
            respStmt: unhandledElement(xml, 'respStmt'),
            quote: unhandledElement(xml, 'quote'),
            listBibl: unhandledElement(xml, 'listBibl'),
            colophon: unhandledElement(xml, 'colophon'),
            rubric: queryAndParseElement<Rubric>(xml, 'rubric', createParser(RubricParser, this.genericParse)),
            incipit: queryAndParseElement<Incipit>(xml, 'incipit', createParser(IncipitParser, this.genericParse)),
            explicit: queryAndParseElement<Explicit>(xml, 'explicit', createParser(ExplicitParser, this.genericParse)),
            finalRubric: queryAndParseElement<FinalRubric>(xml, 'finalRubric', createParser(FinalRubricParser, this.genericParse)),
            decoNote: queryAndParseElement<DecoNote>(xml, 'decoNote', createParser(DecoNoteParser, this.genericParse)),
            filiation: queryAndParseElement<Filiation>(xml, 'filiation', createParser(FiliationParser, this.genericParse)),
            locus: queryAndParseElement<Locus>(xml, 'locus', createParser(LocusParser, this.genericParse)),
            noteEl: queryAndParseElements<Note>(xml, 'note', createParser(NoteParser, this.genericParse)),
        };
    }
}

export class MsItemParser extends MsItemStructParser implements Parser<XMLElement> {
    parse(xml: XMLElement): MsItem {

        return {
            ...super.parse(xml),
            type: MsItem,
            docAuthor: unhandledElement(xml, 'docAuthor'),
            docTitle: unhandledElement(xml, 'docTitle'),
            docImprint: unhandledElement(xml, 'docImprint'),
            docDate: unhandledElement(xml, 'docDate'),
            locusGrp: queryAndParseElement<LocusGrp>(xml, 'locusGrp', createParser(LocusGrpParser, this.genericParse)),
            gapEl: queryAndParseElements(xml, 'gap', createParser(GapParser, this.genericParse)),
        };
    }
}

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

export class CustodialHistParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): CustodialHist {

        return {
            ...super.parse(xml),
            type: CustodialHist,
            structuredData: Array.from(xml.querySelectorAll(':scope > p')).length === 0,
            custEvent: queryAndParseElement(xml, 'custEvent', createParser(CustEventParser, this.genericParse)),
            ab: unhandledElement(xml, 'ab'),
            pEl: queryAndParseElements<Paragraph>(xml, 'p', createParser(ParagraphParser, this.genericParse)),
        };
    }
}

export class SourceParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Source {

        return {
            ...super.parse(xml),
            type: Source,
            pEl: queryAndParseElements<Paragraph>(xml, 'p', createParser(ParagraphParser, this.genericParse)),
        };
    }
}

export class RecordHistParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): RecordHist {

        return {
            ...super.parse(xml),
            type: RecordHist,
            structuredData: Array.from(xml.querySelectorAll(':scope > p')).length === 0,
            change: unhandledElement(xml, 'change'),
            source: queryAndParseElement(xml, 'source', createParser(SourceParser, this.genericParse)),
            ab: unhandledElement(xml, 'ab'),
            pEl: queryAndParseElements<Paragraph>(xml, 'p', createParser(ParagraphParser, this.genericParse)),
        };
    }
}

export class AdminInfoParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): AdminInfo {

        return {
            ...super.parse(xml),
            type: AdminInfo,
            structuredData: Array.from(xml.querySelectorAll(':scope > note')).length === 0,
            noteEl: queryAndParseElements(xml, 'note', createParser(NoteParser, this.genericParse)),
            availability: unhandledElement(xml, 'availability'),
            custodialHist: queryAndParseElement(xml, 'custodialHist', createParser(CustodialHistParser, this.genericParse)),
            recordHist: queryAndParseElement(xml, 'recordHist', createParser(RecordHistParser, this.genericParse)),
        };
    }
}

export class SurrogatesParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Surrogates {

        return {
            ...super.parse(xml),
            type: Surrogates,
            bibl: unhandledElement(xml, 'bibl'),
            pEl: queryAndParseElements<Paragraph>(xml, 'p', createParser(ParagraphParser, this.genericParse)),
        };
    }
}

export class AdditionalParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Additional {

        return {
            ...super.parse(xml),
            type: Summary,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            listBibl: unhandledElement(xml, 'listBibl'),
            adminInfo: queryAndParseElement(xml, 'adminInfo', createParser(AdminInfoParser, this.genericParse)),
            surrogates: queryAndParseElement(xml, 'surrogates', createParser(SurrogatesParser, this.genericParse)),
        };
    }
}

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

export class MsContentsParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): MsContents {

        return {
            ...super.parse(xml),
            type: MsContents,
            summary: queryAndParseElement(xml, 'summary', createParser(SummaryParser, this.genericParse)),
            msItem: queryAndParseElement(xml, 'msItem', createParser(MsItemParser, this.genericParse)),
            msItemStruct: queryAndParseElement(xml, 'msItemStruct', createParser(MsItemStructParser, this.genericParse)),
        };
    }
}

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

class IdentifierParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Identifier {
        return {
            ...super.parse(xml),
            type: AltIdentifier,
            collection: queryAndParseElement(xml, 'repository', createParser(RepositoryParser, this.genericParse)),
            repository: queryAndParseElement(xml, 'collection', createParser(CollectionParser, this.genericParse)),
            idno: unhandledElement(xml, 'idno'),
            region: unhandledElement(xml, 'region'),
            settlement: unhandledElement(xml, 'settlement'),
        };
    }
}

export class AltIdentifierParser extends IdentifierParser implements Parser<XMLElement> {
    parse(xml: XMLElement): AltIdentifier {

        return {
            ...super.parse(xml),
            type: AltIdentifier,
            noteEl: queryAndParseElements(xml, 'note', createParser(NoteParser, this.genericParse)),
        };
    }
}

export class MsNameParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): MsName {

        return {
            ...super.parse(xml),
            type: AltIdentifier,
            name: unhandledElement(xml, 'name'),
            rs: unhandledElement(xml, 'rs'),
            gEl: queryAndParseElements(xml, 'g', createParser(GParser, this.genericParse)),
        };
    }
}

export class InstitutionParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Institution {

        return {
            ...super.parse(xml),
            type: Institution,
            country: unhandledElement(xml, 'country'),
            region: unhandledElement(xml, 'region'),
        };
    }
}

export class MsIdentifierParser extends IdentifierParser implements Parser<XMLElement> {
    parse(xml: XMLElement): MsIdentifier {

        return {
            ...super.parse(xml),
            type: MsIdentifier,
            id: getID(xml),
            institution: queryAndParseElement(xml, 'institution', createParser(InstitutionParser, this.genericParse)),
            altIdentifier: queryAndParseElement(xml, 'altIdentifier', createParser(AltIdentifierParser, this.genericParse)),
            msName: queryAndParseElement(xml, 'msName', createParser(MsNameParser, this.genericParse)),
            country: unhandledElement(xml, 'country'),
        };
    }
}

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
            lbEl: queryAndParseElements(xml, 'lb', createParser(LBParser, this.genericParse)),
            hi: unhandledElement(xml, 'hi'),
        };
    }
}

export class MsFragParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): MsFrag {

        return {
            ...super.parse(xml),
            type: MsFrag,
            additional: queryAndParseElement(xml, 'additional', createParser(AdditionalParser, this.genericParse)),
            altIdentifier: queryAndParseElement(xml, 'altIdentifier', createParser(AltIdentifierParser, this.genericParse)),
            history: queryAndParseElement(xml, 'history', createParser(HistoryParser, this.genericParse)),
            msContents: queryAndParseElement(xml, 'msContents', createParser(MsContentsParser, this.genericParse)),
            msIdentifier: queryAndParseElement(xml, 'msIdentifier', createParser(MsIdentifierParser, this.genericParse)),
            physDesc: queryAndParseElement(xml, 'physDesc', createParser(PhysDescParser, this.genericParse)),

        };
    }
}

export class MsPartParser extends MsFragParser implements Parser<XMLElement> {
    parse(xml: XMLElement): MsPart {

        return {
            ...super.parse(xml),
            type: MsPart,
            msPart: queryAndParseElement(xml, 'msPart', createParser(MsPartParser, this.genericParse)),
            head: queryAndParseElement(xml, 'head', createParser(HeadParser, this.genericParse)),
        };
    }
}

export class MsDescParser extends MsPartParser implements Parser<XMLElement> {
    parse(xml: XMLElement): MsDesc {

        return {
            ...super.parse(xml),
            type: MsDesc,
            id: getID(xml),
            msFrag: queryAndParseElement(xml, 'msFrag', createParser(MsFragParser, this.genericParse)),
        };
    }
}
