import {
    AccMat, Acquisition, Additional, Additions, AdminInfo, AltIdentifier, Binding, BindingDesc, CollectionEl, CustodialHist, DecoDesc,
    DecoNote, Explicit, Filiation, FinalRubric, HandDesc, Head, History, Incipit, Institution, LayoutDesc, Locus,
    LocusGrp, MaterialValues, MsContents, MsDesc, MsFrag, MsIdentifier, MsItem, MsItemStruct, MsName, MsPart, MusicNotation,
    ObjectDesc, OrigDate, Origin, OrigPlace, PhysDesc, Provenance, RecordHist, Repository, Rubric, ScriptDesc, Seal, SealDesc,
    Summary, Support, SupportDesc, Surrogates, TypeDesc, TypeNote, XMLElement,
} from '../../models/evt-models';
import { AttributeParser, EmptyParser, GapParser, LBParser, NoteParser, ParagraphParser } from './basic-parsers';
import { GParser } from './character-declarations-parser';
import { createParser, getClass, getDefaultN, getID, parseChildren, Parser } from './parser-models';

export class AcquisitionParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): Acquisition {
        const attributes = this.attributeParser.parse(xml);
        const { notBefore, notAfter } = attributes;
        // TODO: Add specific parser when name is handled
        const name = Array.from(xml.querySelectorAll<XMLElement>(':scope > name'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: Acquisition,
            content: parseChildren(xml, this.genericParse),
            attributes,
            notBefore,
            notAfter,
            name,
        };
    }
}

export class OrigDateParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): OrigDate {
        const attributes = this.attributeParser.parse(xml);
        const { notBefore, notAfter, when, origDateType } = attributes;

        return {
            type: OrigDate,
            content: parseChildren(xml, this.genericParse),
            attributes,
            notBefore,
            notAfter,
            when,
            origDateType,
        };
    }
}

export class OrigPlaceParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): OrigPlace {
        const attributes = this.attributeParser.parse(xml);
        const { key, origPlaceType } = attributes;

        return {
            type: OrigPlace,
            content: parseChildren(xml, this.genericParse),
            attributes,
            key,
            origPlaceType,
        };
    }
}

export class OriginParser extends EmptyParser implements Parser<XMLElement> {
    private origDateParser = createParser(OrigDateParser, this.genericParse);
    private origPlaceParser = createParser(OrigPlaceParser, this.genericParse);
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): Origin {
        const attributes = this.attributeParser.parse(xml);
        const { notBefore, notAfter, evidence, resp } = attributes;
        const origDateEl = xml.querySelector<XMLElement>('scope > origDate');
        const origPlaceEl = xml.querySelector<XMLElement>('scope > origPlace');

        return {
            type: Origin,
            content: parseChildren(xml, this.genericParse),
            attributes,
            notBefore,
            notAfter,
            evidence,
            resp,
            origDate: origDateEl ? this.origDateParser.parse(origDateEl) : undefined,
            origPlace: origPlaceEl ? this.origPlaceParser.parse(origPlaceEl) : undefined,
        };
    }
}

export class ProvenanceParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): Provenance {
        const attributes = this.attributeParser.parse(xml);
        const { when } = attributes;

        return {
            type: Acquisition,
            content: parseChildren(xml, this.genericParse),
            attributes,
            when,
        };
    }
}

export class HistoryParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private acquisitionParser = createParser(AcquisitionParser, this.genericParse);
    private originParser = createParser(OriginParser, this.genericParse);
    private provenanceParser = createParser(ProvenanceParser, this.genericParse);
    private summaryParser = createParser(ProvenanceParser, this.genericParse);

    parse(xml: XMLElement): History {
        const acquisitionEl = xml.querySelector<XMLElement>('scope > acquisition');
        const originEl = xml.querySelector<XMLElement>('scope > origin');
        const provenanceEl = xml.querySelector<XMLElement>('scope > provenance');
        const summaryEl = xml.querySelector<XMLElement>('scope > provenance');

        return {
            type: History,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            acquisition: acquisitionEl ? this.acquisitionParser.parse(acquisitionEl) : undefined,
            origin: originEl ? this.originParser.parse(originEl) : undefined,
            provenance: provenanceEl ? this.provenanceParser.parse(provenanceEl) : undefined,
            summary: summaryEl ? this.summaryParser.parse(summaryEl) : undefined,
        };
    }
}

export class LayoutDescParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private summaryParser = createParser(ProvenanceParser, this.genericParse);
    private pParser = createParser(ParagraphParser, this.genericParse);

    parse(xml: XMLElement): LayoutDesc {
        const pEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > p')).map(p => this.pParser.parse(p));
        const summaryEl = xml.querySelector<XMLElement>('scope > provenance');
        // TODO: Add specific parser when ab is handled
        const ab = Array.from(xml.querySelectorAll<XMLElement>(':scope > ab'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when layout is handled
        const layout = Array.from(xml.querySelectorAll<XMLElement>(':scope > layout'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: LayoutDesc,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            structuredData: Array.from(xml.querySelectorAll(':scope > p')).length === 0,
            pEl,
            ab,
            layout,
            summary: summaryEl ? this.summaryParser.parse(summaryEl) : undefined,
        };
    }
}

export class SupportParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): Support {
        // TODO: Add specific parser when material is handled
        const material = Array.from(xml.querySelectorAll<XMLElement>(':scope > material'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: Support,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            material,
        };
    }
}

export class SupportDescParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private pParser = createParser(ParagraphParser, this.genericParse);
    private supportParser = createParser(SupportParser, this.genericParse);

    parse(xml: XMLElement): SupportDesc {
        const pEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > p')).map(p => this.pParser.parse(p));
        const supportEl = xml.querySelector<XMLElement>('scope > support');
        // TODO: Add specific parser when ab is handled
        const ab = Array.from(xml.querySelectorAll<XMLElement>(':scope > ab'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when extent is handled
        const extent = Array.from(xml.querySelectorAll<XMLElement>(':scope > extent'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when collation is handled
        const collation = Array.from(xml.querySelectorAll<XMLElement>(':scope > collation'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when foliation is handled
        const foliation = Array.from(xml.querySelectorAll<XMLElement>(':scope > foliation'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when condition is handled
        const condition = Array.from(xml.querySelectorAll<XMLElement>(':scope > condition'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: SupportDesc,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            material: xml.getAttribute('material') as MaterialValues,
            pEl,
            ab,
            extent,
            collation,
            foliation,
            support: supportEl ? this.supportParser.parse(supportEl) : undefined,
            condition,
        };
    }
}

export class ObjectDescParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private layoutDescParser = createParser(LayoutDescParser, this.genericParse);
    private supportDescParser = createParser(SupportDescParser, this.genericParse);

    parse(xml: XMLElement): ObjectDesc {
        const attributes = this.attributeParser.parse(xml);
        const { form } = attributes;
        const layoutDescEl = xml.querySelector<XMLElement>('scope > layoutDesc');
        const supportDescEl = xml.querySelector<XMLElement>('scope > supportDesc');

        return {
            type: ObjectDesc,
            content: parseChildren(xml, this.genericParse),
            attributes,
            form,
            layoutDesc: layoutDescEl ? this.layoutDescParser.parse(layoutDescEl) : undefined,
            supportDesc: supportDescEl ? this.supportDescParser.parse(supportDescEl) : undefined,
        };
    }
}

export class DecoNoteParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): DecoNote {
        const attributes = this.attributeParser.parse(xml);
        const { decoNoteType } = attributes;

        return {
            type: DecoNote,
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            decoNoteType,
        };
    }
}

export class BindingParser extends EmptyParser implements Parser<XMLElement> {
    private decoNoteParser = createParser(DecoNoteParser, this.genericParse);
    private pParser = createParser(ParagraphParser, this.genericParse);
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): Binding {
        const decoNoteEl = xml.querySelector<XMLElement>('scope > decoNote');
        const pEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > p')).map(p => this.pParser.parse(p));
        // TODO: Add specific parser when condition is handled
        const condition = Array.from(xml.querySelectorAll<XMLElement>(':scope > condition'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when ab is handled
        const ab = Array.from(xml.querySelectorAll<XMLElement>(':scope > ab'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: Binding,
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            contemporary: true || false,
            condition,
            decoNote: decoNoteEl ? this.decoNoteParser.parse(decoNoteEl) : undefined,
            pEl,
            ab,
        };
    }
}

export class BindingDescParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private decoNoteParser = createParser(DecoNoteParser, this.genericParse);
    private bindingParser = createParser(BindingParser, this.genericParse);

    parse(xml: XMLElement): BindingDesc {
        const decoNoteEl = xml.querySelector<XMLElement>('scope > decoNote');
        const bindingEl = xml.querySelector<XMLElement>('scope > binding');
        // TODO: Add specific parser when condition is handled
        const condition = Array.from(xml.querySelectorAll<XMLElement>(':scope > condition'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: BindingDesc,
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            binding: bindingEl ? this.bindingParser.parse(bindingEl) : undefined,
            condition,
            decoNote: decoNoteEl ? this.decoNoteParser.parse(decoNoteEl) : undefined,
        };
    }
}

export class SummaryParser extends EmptyParser implements Parser<XMLElement> {
    private pParser = createParser(ParagraphParser, this.genericParse);
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): Summary {
        const pEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > p')).map(p => this.pParser.parse(p));

        return {
            type: Summary,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            pEl,
        };
    }
}

export class DecoDescParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private pParser = createParser(ParagraphParser, this.genericParse);
    private decoNoteParser = createParser(DecoNoteParser, this.genericParse);
    private summaryParser = createParser(SummaryParser, this.genericParse);

    parse(xml: XMLElement): DecoDesc {
        const pEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > p')).map(p => this.pParser.parse(p));
        const decoNoteEl = xml.querySelector<XMLElement>('scope > decoNote');
        const summaryEl = xml.querySelector<XMLElement>('scope > summary');
        // TODO: Add specific parser when ab is handled
        const ab = Array.from(xml.querySelectorAll<XMLElement>(':scope > ab'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: DecoDesc,
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            decoNote: decoNoteEl ? this.decoNoteParser.parse(decoNoteEl) : undefined,
            pEl,
            ab,
            summary: summaryEl ? this.summaryParser.parse(summaryEl) : undefined,
        };
    }
}

export class HandDescParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): HandDesc {
        const attributes = this.attributeParser.parse(xml);
        const { hands } = attributes;
        // TODO: Add specific parser when handNote is handled
        const handNote = Array.from(xml.querySelectorAll<XMLElement>(':scope > handNote'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: HandDesc,
            content: parseChildren(xml, this.genericParse),
            attributes,
            hands,
            handNote,
        };
    }
}

export class AdditionsParser extends EmptyParser implements Parser<XMLElement> {
    private pParser = createParser(ParagraphParser, this.genericParse);
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): Additions {
        const pEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > p')).map(p => this.pParser.parse(p));

        return {
            type: Additions,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            pEl,
        };
    }
}

export class ScriptDescParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private summaryParser = createParser(SummaryParser, this.genericParse);

    parse(xml: XMLElement): ScriptDesc {
        const summaryEl = xml.querySelector<XMLElement>('scope > summary');
        // TODO: Add specific parser when scriptNote is handled
        const scriptNote = Array.from(xml.querySelectorAll<XMLElement>(':scope > scriptNote'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: ScriptDesc,
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            scriptNote,
            summary: summaryEl ? this.summaryParser.parse(summaryEl) : undefined,
        };
    }
}

export class SealParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private pParser = createParser(ParagraphParser, this.genericParse);
    private decoNoteParser = createParser(DecoNoteParser, this.genericParse);

    parse(xml: XMLElement): Seal {
        const decoNoteEl = xml.querySelector<XMLElement>('scope > decoNote');
        const pEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > p')).map(p => this.pParser.parse(p));
        // TODO: Add specific parser when ab is handled
        const ab = Array.from(xml.querySelectorAll<XMLElement>(':scope > ab'))
        .map(e => parseChildren(e, this.genericParse));
        const attributes = this.attributeParser.parse(xml);
        const { sealType } = attributes;

        return {
            type: Seal,
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            contemporary: true || false,
            decoNote: decoNoteEl ? this.decoNoteParser.parse(decoNoteEl) : undefined,
            sealType,
            n: getDefaultN(attributes.n),
            pEl,
            ab,
        };
    }
}

export class SealDescParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private sealParser = createParser(SealParser, this.genericParse);

    parse(xml: XMLElement): SealDesc {
        const sealEl = xml.querySelector<XMLElement>('scope > seal');

        return {
            type: SealDesc,
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            seal: sealEl ? this.sealParser.parse(sealEl) : undefined,
        };
    }
}

export class TypeNoteParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): TypeNote {
        const attributes = this.attributeParser.parse(xml);
        const { scope } = attributes;

        return {
            type: TypeNote,
            content: parseChildren(xml, this.genericParse),
            attributes,
            id: getID(xml),
            scope,
        };
    }
}

export class TypeDescParser extends EmptyParser implements Parser<XMLElement> {
    private summaryParser = createParser(SummaryParser, this.genericParse);
    private typeNoteParser = createParser(TypeNoteParser, this.genericParse);
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): TypeDesc {
        const summaryEl = xml.querySelector<XMLElement>('scope > summary');
        const typeNoteEl = xml.querySelector<XMLElement>('scope > typeNote');

        return {
            type: TypeDesc,
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            summary: summaryEl ? this.summaryParser.parse(summaryEl) : undefined,
            typeNote: typeNoteEl ? this.typeNoteParser.parse(typeNoteEl) : undefined,
        };
    }
}

export class AccMatParser extends EmptyParser implements Parser<XMLElement> {
    private pParser = createParser(ParagraphParser, this.genericParse);
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): AccMat {
        const pEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > p')).map(p => this.pParser.parse(p));

        return {
            type: AccMat,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            pEl,
        };
    }
}

export class MusicNotationParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): MusicNotation {
        // TODO: Add specific parser when summary is handled
        const term = Array.from(xml.querySelectorAll<XMLElement>(':scope > term'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: MusicNotation,
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            term,
        };
    }
}

export class PhysDescParser extends EmptyParser implements Parser<XMLElement> {
    private objectDescParser = createParser(ObjectDescParser, this.genericParse);
    private bindingDescParser = createParser(BindingDescParser, this.genericParse);
    private decoDescParser = createParser(DecoDescParser, this.genericParse);
    private handDescParser = createParser(HandDescParser, this.genericParse);
    private scriptDescParser = createParser(ScriptDescParser, this.genericParse);
    private sealDescParser = createParser(SealDescParser, this.genericParse);
    private typeDescParser = createParser(TypeDescParser, this.genericParse);
    private musicNotationParser = createParser(MusicNotationParser, this.genericParse);
    private accMatParser = createParser(AccMatParser, this.genericParse);
    private additionsParser = createParser(AdditionsParser, this.genericParse);
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): PhysDesc {
        const objectDescEl = xml.querySelector<XMLElement>('scope > objectDesc');
        const bindingDescEl = xml.querySelector<XMLElement>('scope > bindingDesc');
        const decoDescEl = xml.querySelector<XMLElement>('scope > decoDesc');
        const handDescEl = xml.querySelector<XMLElement>('scope > handDesc');
        const scriptDescEl = xml.querySelector<XMLElement>('scope > scriptDesc');
        const sealDescEl = xml.querySelector<XMLElement>('scope > sealDesc');
        const typeDescEl = xml.querySelector<XMLElement>('scope > typeDesc');
        const musicNotationEl = xml.querySelector<XMLElement>('scope > musicNotation');
        const accMatEl = xml.querySelector<XMLElement>('scope > accMat');
        const additionsEl = xml.querySelector<XMLElement>('scope > additions');

        return {
            type: PhysDesc,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            structuredData: Array.from(xml.querySelectorAll(':scope > p')).length === 0,
            objectDesc: objectDescEl ? this.objectDescParser.parse(objectDescEl) : undefined,
            bindingDesc: bindingDescEl ? this.bindingDescParser.parse(bindingDescEl) : undefined,
            decoDesc: decoDescEl ? this.decoDescParser.parse(decoDescEl) : undefined,
            handDesc: handDescEl ? this.handDescParser.parse(handDescEl) : undefined,
            accMat: accMatEl ? this.accMatParser.parse(accMatEl) : undefined,
            additions: additionsEl ? this.additionsParser.parse(additionsEl) : undefined,
            musicNotation: musicNotationEl ? this.musicNotationParser.parse(musicNotationEl) : undefined,
            scriptDesc: scriptDescEl ? this.scriptDescParser.parse(scriptDescEl) : undefined,
            sealDesc: sealDescEl ? this.sealDescParser.parse(sealDescEl) : undefined,
            typeDesc: typeDescEl ? this.typeDescParser.parse(typeDescEl) : undefined,
        };
    }
}

export class FinalRubricParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private lbParser = createParser(LBParser, this.genericParse);

    parse(xml: XMLElement): FinalRubric {
        const lbEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > lb')).map(l => this.lbParser.parse(l));

        return {
            type: FinalRubric,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            lbEl,
        };
    }
}

export class LocusParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private gParser = createParser(GParser, this.genericParse);

    parse(xml: XMLElement): Locus {
        const gEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > g')).map(g => this.gParser.parse(g));
        const locusEl = xml.querySelector<XMLElement>('scope > locus');
        // TODO: Add specific parser when hi is handled
        const hi = Array.from(xml.querySelectorAll<XMLElement>(':scope > hi'))
        .map(e => parseChildren(e, this.genericParse));
        const attributes = this.attributeParser.parse(xml);
        const { scheme, from, to, facs, target } = attributes;

        return {
            type: Locus,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes,
            scheme,
            from,
            to,
            facs,
            target,
            gEl,
            locus : locusEl ? this.parse(locusEl) : undefined,
            hi,
        };
    }
}

export class LocusGrpParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private locusParser = createParser(LocusParser, this.genericParse);

    parse(xml: XMLElement): LocusGrp {
        const locusEl = xml.querySelector<XMLElement>('scope > locus');
        const attributes = this.attributeParser.parse(xml);
        const { scheme } = attributes;

        return {
            type: LocusGrp,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes,
            scheme,
            locus: locusEl ? this.locusParser.parse(locusEl) : undefined,
        };
    }
}

export class IncipitParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private lbParser = createParser(LBParser, this.genericParse);
    private locusParser = createParser(LocusParser, this.genericParse);

    parse(xml: XMLElement): Incipit {
        const lbEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > lb')).map(l => this.lbParser.parse(l));
        const locusEl = xml.querySelector<XMLElement>('scope > locus');
        const attributes = this.attributeParser.parse(xml);
        const { lang } = attributes;

        return {
            type: Incipit,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes,
            defective: true || false,
            lang,
            lbEl,
            locus: locusEl ? this.locusParser.parse(locusEl) : undefined,
        };
    }
}

export class ExplicitParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private locusParser = createParser(LocusParser, this.genericParse);

    parse(xml: XMLElement): Explicit {
        const locusEl = xml.querySelector<XMLElement>('scope > locus');
        const attributes = this.attributeParser.parse(xml);
        const { lang } = attributes;

        return {
            type: Explicit,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes,
            defective: true || false,
            lang,
            locus: locusEl ? this.locusParser.parse(locusEl) : undefined,
        };
    }
}

export class RubricParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private lbParser = createParser(LBParser, this.genericParse);
    private locusParser = createParser(LocusParser, this.genericParse);

    parse(xml: XMLElement): Rubric {
        const lbEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > lb')).map(l => this.lbParser.parse(l));
        const locusEl = xml.querySelector<XMLElement>('scope > locus');
        const attributes = this.attributeParser.parse(xml);
        const { lang, rend } = attributes;

        return {
            type: Rubric,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes,
            lang,
            rend,
            lbEl,
            locus: locusEl ? this.locusParser.parse(locusEl) : undefined,
        };
    }
}

export class FiliationParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): Filiation {
        const attributes = this.attributeParser.parse(xml);
        const { filiationType } = attributes;

        return {
            type: Filiation,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes,
            filiationType,
        };
    }
}

export class MsItemParser extends EmptyParser implements Parser<XMLElement> {
    private noteParser = createParser(NoteParser, this.genericParse);
    private gapParser = createParser(GapParser, this.genericParse);
    private rubricParser = createParser(RubricParser, this.genericParse);
    private finalRubricParser = createParser(FinalRubricParser, this.genericParse);
    private incipitParser = createParser(IncipitParser, this.genericParse);
    private explicitParser = createParser(ExplicitParser, this.genericParse);
    private locusParser = createParser(LocusParser, this.genericParse);
    private locusGrpParser = createParser(LocusGrpParser, this.genericParse);
    private decoNoteParser = createParser(DecoNoteParser, this.genericParse);
    private filiationParser = createParser(FiliationParser, this.genericParse);
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): MsItem {
        const attributes = this.attributeParser.parse(xml);
        const noteEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > note')).map(n => this.noteParser.parse(n));
        const gapEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > gap')).map(g => this.gapParser.parse(g));
        const rubricEl = xml.querySelector<XMLElement>('scope > rubric');
        const finalRubricEl = xml.querySelector<XMLElement>('scope > finalRubric');
        const incipitEl = xml.querySelector<XMLElement>('scope > incipit');
        const explicitEl = xml.querySelector<XMLElement>('scope > incipit');
        const locusEl = xml.querySelector<XMLElement>('scope > locus');
        const locusGrpEl = xml.querySelector<XMLElement>('scope > locusGrp');
        const decoNoteEl = xml.querySelector<XMLElement>('scope > decoNote');
        const filiationEl = xml.querySelector<XMLElement>('scope > filiation');
        // TODO: Add specific parser when author is handled
        const author = Array.from(xml.querySelectorAll<XMLElement>(':scope > author'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when title is handled
        const title = Array.from(xml.querySelectorAll<XMLElement>(':scope > title'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when textLang is handled
        const textLang = Array.from(xml.querySelectorAll<XMLElement>(':scope > textLang'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when docAuthor is handled
        const docAuthor = Array.from(xml.querySelectorAll<XMLElement>(':scope > docAuthor'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when docTitle is handled
        const docTitle = Array.from(xml.querySelectorAll<XMLElement>(':scope > docTitle'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when docImprint is handled
        const docImprint = Array.from(xml.querySelectorAll<XMLElement>(':scope > docImprint'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when docDate is handled
        const docDate = Array.from(xml.querySelectorAll<XMLElement>(':scope > docDate'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when bibl is handled
        const bibl = Array.from(xml.querySelectorAll<XMLElement>(':scope > bibl'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when respStmt is handled
        const respStmt = Array.from(xml.querySelectorAll<XMLElement>(':scope > respStmt'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when quote is handled
        const quote = Array.from(xml.querySelectorAll<XMLElement>(':scope > quote'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when listBibl is handled
        const listBibl = Array.from(xml.querySelectorAll<XMLElement>(':scope > listBibl'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when colophon is handled
        const colophon = Array.from(xml.querySelectorAll<XMLElement>(':scope > colophon'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: MsItem,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes,
            n: getDefaultN(attributes.n),
            defective: true || false,
            author,
            respStmt,
            rubric: rubricEl ? this.rubricParser.parse(rubricEl) : undefined,
            incipit: incipitEl ? this.incipitParser.parse(incipitEl) : undefined,
            title,
            quote,
            explicit: explicitEl ? this.explicitParser.parse(explicitEl) : undefined,
            finalRubric: finalRubricEl ? this.finalRubricParser.parse(finalRubricEl) : undefined,
            colophon,
            decoNote: decoNoteEl ? this.decoNoteParser.parse(decoNoteEl) : undefined,
            listBibl,
            bibl,
            filiation: filiationEl ? this.filiationParser.parse(filiationEl) : undefined,
            noteEl,
            textLang,
            docAuthor,
            docTitle,
            docImprint,
            docDate,
            locus: locusEl ? this.locusParser.parse(locusEl) : undefined,
            locusGrp: locusGrpEl ? this.locusGrpParser.parse(locusGrpEl) : undefined,
            gapEl,

        };
    }
}

export class MsItemStructParser extends EmptyParser implements Parser<XMLElement> {
    private noteParser = createParser(NoteParser, this.genericParse);
    private rubricParser = createParser(RubricParser, this.genericParse);
    private finalRubricParser = createParser(FinalRubricParser, this.genericParse);
    private incipitParser = createParser(IncipitParser, this.genericParse);
    private explicitParser = createParser(ExplicitParser, this.genericParse);
    private locusParser = createParser(LocusParser, this.genericParse);
    private decoNoteParser = createParser(DecoNoteParser, this.genericParse);
    private filiationParser = createParser(FiliationParser, this.genericParse);
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): MsItemStruct {
        const attributes = this.attributeParser.parse(xml);
        const noteEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > note')).map(n => this.noteParser.parse(n));
        const rubricEl = xml.querySelector<XMLElement>('scope > rubric');
        const finalRubricEl = xml.querySelector<XMLElement>('scope > finalRubric');
        const incipitEl = xml.querySelector<XMLElement>('scope > incipit');
        const explicitEl = xml.querySelector<XMLElement>('scope > explicit');
        const locusEl = xml.querySelector<XMLElement>('scope > locus');
        const decoNoteEl = xml.querySelector<XMLElement>('scope > decoNote');
        const filiationEl = xml.querySelector<XMLElement>('scope > filiation');
        // TODO: Add specific parser when author is handled
        const author = Array.from(xml.querySelectorAll<XMLElement>(':scope > author'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when title is handled
        const title = Array.from(xml.querySelectorAll<XMLElement>(':scope > title'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when bibl is handled
        const bibl = Array.from(xml.querySelectorAll<XMLElement>(':scope > bibl'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when restStmt is handled
        const restStmt = Array.from(xml.querySelectorAll<XMLElement>(':scope > restStmt'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when quote is handled
        const quote = Array.from(xml.querySelectorAll<XMLElement>(':scope > quote'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when colophon is handled
        const colophon = Array.from(xml.querySelectorAll<XMLElement>(':scope > colophon'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when listBibl is handled
        const listBibl = Array.from(xml.querySelectorAll<XMLElement>(':scope > listBibl'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when textLang is handled
        const textLang = Array.from(xml.querySelectorAll<XMLElement>(':scope > textLang'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: MsItemStruct,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes,
            n: getDefaultN(attributes.n),
            defective: true || false,
            author,
            restStmt,
            title,
            rubric: rubricEl ? this.rubricParser.parse(rubricEl) : undefined,
            incipit: incipitEl ? this.incipitParser.parse(incipitEl) : undefined,
            quote,
            explicit: explicitEl ? this.explicitParser.parse(explicitEl) : undefined,
            finalRubric: finalRubricEl ? this.finalRubricParser.parse(finalRubricEl) : undefined,
            colophon,
            decoNote: decoNoteEl ? this.decoNoteParser.parse(decoNoteEl) : undefined,
            listBibl,
            bibl,
            filiation: filiationEl ? this.filiationParser.parse(filiationEl) : undefined,
            noteEl,
            textLang,
            locus: locusEl ? this.locusParser.parse(locusEl) : undefined,
        };
    }
}

export class CustodialHistParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private pParser = createParser(ParagraphParser, this.genericParse);

    parse(xml: XMLElement): CustodialHist {
        const pEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > p')).map(p => this.pParser.parse(p));
        // TODO: Add specific parser when ab is handled
        const ab = Array.from(xml.querySelectorAll<XMLElement>(':scope > ab'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when custEvent is handled
        const custEvent = Array.from(xml.querySelectorAll<XMLElement>(':scope > custEvent'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: CustodialHist,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            structuredData: Array.from(xml.querySelectorAll(':scope > p')).length === 0,
            custEvent,
            ab,
            pEl,
        };
    }
}

export class RecordHistParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private pParser = createParser(ParagraphParser, this.genericParse);

    parse(xml: XMLElement): RecordHist {
        const pEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > p')).map(p => this.pParser.parse(p));
        // TODO: Add specific parser when change is handled
        const change = Array.from(xml.querySelectorAll<XMLElement>(':scope > change'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when source is handled
        const source = Array.from(xml.querySelectorAll<XMLElement>(':scope > source'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when ab is handled
        const ab = Array.from(xml.querySelectorAll<XMLElement>(':scope > ab'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: RecordHist,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            structuredData: Array.from(xml.querySelectorAll(':scope > p')).length === 0,
            change,
            source,
            ab,
            pEl,
        };
    }
}

export class AdminInfoParser extends EmptyParser implements Parser<XMLElement> {
    private custodialHistParser = createParser(CustodialHistParser, this.genericParse);
    private recordHistParser = createParser(RecordHistParser, this.genericParse);
    private noteParser = createParser(NoteParser, this.genericParse);
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): AdminInfo {
        const custodialHistEl = xml.querySelector<XMLElement>('scope > custodialHist');
        const recordHistEl = xml.querySelector<XMLElement>('scope > recordHist');
        const noteEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > note')).map(n => this.noteParser.parse(n));
        // TODO: Add specific parser when availability is handled
        const availability = Array.from(xml.querySelectorAll<XMLElement>(':scope > availability'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: AdminInfo,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            structuredData: Array.from(xml.querySelectorAll(':scope > note')).length === 0,
            noteEl,
            availability,
            custodialHist: custodialHistEl ? this.custodialHistParser.parse(custodialHistEl) : undefined,
            recordHist: recordHistEl ? this.recordHistParser.parse(recordHistEl) : undefined,
        };
    }
}

export class SurrogatesParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private pParser = createParser(ParagraphParser, this.genericParse);

    parse(xml: XMLElement): Surrogates {
        const pEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > p')).map(p => this.pParser.parse(p));
        // TODO: Add specific parser when bibl is handled
        const bibl = Array.from(xml.querySelectorAll<XMLElement>(':scope > bibl'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: Surrogates,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            bibl,
            pEl,
        };
    }
}

export class AdditionalParser extends EmptyParser implements Parser<XMLElement> {
    private adminInfoParser = createParser(AdminInfoParser, this.genericParse);
    private surrogatesParser = createParser(SurrogatesParser, this.genericParse);
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): Additional {
        const adminInfoEl = xml.querySelector<XMLElement>('scope > adminInfo');
        const surrogatesEl = xml.querySelector<XMLElement>('scope > adminInfo');
        // TODO: Add specific parser when listBibl is handled
        const listBibl = Array.from(xml.querySelectorAll<XMLElement>(':scope > listBibl'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: Summary,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            listBibl,
            adminInfo: adminInfoEl ? this.adminInfoParser.parse(adminInfoEl) : undefined,
            surrogates: surrogatesEl ? this.surrogatesParser.parse(surrogatesEl) : undefined,
        };
    }
}

export class  RepositoryParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): Repository {
        const attributes = this.attributeParser.parse(xml);
        const { lang } = attributes;

        return {
            type: Repository,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes,
            lang,
        };
    }
}

export class MsContentsParser extends EmptyParser implements Parser<XMLElement> {
    private msItemParser = createParser(MsItemParser, this.genericParse);
    private msItemStructParser = createParser(MsItemStructParser, this.genericParse);
    private summaryParser = createParser(SummaryParser, this.genericParse);
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): MsContents {
        const msItemEl = xml.querySelector<XMLElement>('scope > msItem');
        const msItemStructEl = xml.querySelector<XMLElement>('scope > msItemStruct');
        const summaryEl = xml.querySelector<XMLElement>('scope > summary');

        return {
            type: MsContents,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            summary:  summaryEl ? this.summaryParser.parse(summaryEl) : undefined,
            msItem: msItemEl ? this.msItemParser.parse(msItemEl) : undefined,
            msItemStruct: msItemStructEl ? this.msItemStructParser.parse(msItemStructEl) : undefined,
        };
    }
}

export class  CollectionParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): CollectionEl {
        const attributes = this.attributeParser.parse(xml);
        const { collectionType } = attributes;

        return {
            type: CollectionEl,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes,
            collectionType,
        };
    }
}

export class  AltIdentifierParser extends EmptyParser implements Parser<XMLElement> {
    private noteParser = createParser(NoteParser, this.genericParse);
    private repositoryParser = createParser(RepositoryParser, this.genericParse);
    private collectionParser = createParser(CollectionParser, this.genericParse);
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): AltIdentifier {
        const repositoryEl = xml.querySelector<XMLElement>('scope > repository');
        const noteEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > note')).map(n => this.noteParser.parse(n));
        const collectionEl = xml.querySelector<XMLElement>('scope > collection');
        // TODO: Add specific parser when idno is handled
        const idno = Array.from(xml.querySelectorAll<XMLElement>(':scope > idno'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when region is handled
        const region = Array.from(xml.querySelectorAll<XMLElement>(':scope > region'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when settlement is handled
        const settlement = Array.from(xml.querySelectorAll<XMLElement>(':scope > settlement'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: AltIdentifier,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            noteEl,
            idno,
            collection: collectionEl ? this.collectionParser.parse(collectionEl) : undefined,
            repository: repositoryEl ? this.repositoryParser.parse(repositoryEl) : undefined,
            region,
            settlement,
        };
    }
}

export class  MsNameParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private gParser = createParser(GParser, this.genericParse);

    parse(xml: XMLElement): MsName {
        const gEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > g')).map(g => this.gParser.parse(g));
        // TODO: Add specific parser when name is handled
        const name = Array.from(xml.querySelectorAll<XMLElement>(':scope > name'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when name is handled
        const rs = Array.from(xml.querySelectorAll<XMLElement>(':scope > rs'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: AltIdentifier,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            name,
            rs,
            gEl,
        };
    }
}

export class  InstitutionParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): Institution {
        // TODO: Add specific parser when country is handled
        const country = Array.from(xml.querySelectorAll<XMLElement>(':scope > country'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when region is handled
        const region = Array.from(xml.querySelectorAll<XMLElement>(':scope > region'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: Institution,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            country,
            region,
        };
    }
}

export class MsIdentifierParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private altIdentifierParser = createParser(AltIdentifierParser, this.genericParse);
    private msNameParser = createParser(MsNameParser, this.genericParse);
    private repositoryParser = createParser(RepositoryParser, this.genericParse);
    private institutionParser = createParser(InstitutionParser, this.genericParse);
    private collectionParser = createParser(CollectionParser, this.genericParse);

    parse(xml: XMLElement): MsIdentifier {
        const altIdentifierEl = xml.querySelector<XMLElement>('scope > altIdentifier');
        const msNameEl = xml.querySelector<XMLElement>('scope > msName');
        const repositoryEl = xml.querySelector<XMLElement>('scope > repository');
        const institutionEl = xml.querySelector<XMLElement>('scope > institution');
        const collectionEl = xml.querySelector<XMLElement>('scope > collection');
        // TODO: Add specific parser when settlement is handled
        const settlement = Array.from(xml.querySelectorAll<XMLElement>(':scope > settlement'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when idno is handled
        const idno = Array.from(xml.querySelectorAll<XMLElement>(':scope > idno'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when msName is handled
        const country = Array.from(xml.querySelectorAll<XMLElement>(':scope > country'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when altIdentifier is handled
        const region = Array.from(xml.querySelectorAll<XMLElement>(':scope > region'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: MsIdentifier,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            id: getID(xml),
            settlement,
            repository: repositoryEl ? this.repositoryParser.parse(repositoryEl) : undefined,
            idno,
            institution: institutionEl ? this.institutionParser.parse(institutionEl) : undefined,
            altIdentifier: altIdentifierEl ? this.altIdentifierParser.parse(altIdentifierEl) : undefined,
            msName: msNameEl ? this.msNameParser.parse(msNameEl) : undefined,
            collection: collectionEl ? this.collectionParser.parse(collectionEl) : undefined,
            country,
            region,
        };
    }
}

export class HeadParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private lbParser = createParser(LBParser, this.genericParse);

    parse(xml: XMLElement): Head {
        const lbEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > lb')).map(l => this.lbParser.parse(l));
        const attributes = this.attributeParser.parse(xml);
        const { place, rend, style, rendition, facs, n } = attributes;
        // TODO: Add specific parser when hi is handled
        const hi = Array.from(xml.querySelectorAll<XMLElement>(':scope > hi'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: Head,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            place,
            rend,
            style,
            rendition,
            n: getDefaultN(n),
            facs,
            lbEl,
            hi,
        };
    }
}

export class MsPartParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private msIdentifierParser = createParser(MsIdentifierParser, this.genericParse);
    private msContentsParser = createParser(MsContentsParser, this.genericParse);
    private physDescParser = createParser(PhysDescParser, this.genericParse);
    private historyParser = createParser(HistoryParser, this.genericParse);
    private additionalParser = createParser(AdditionalParser, this.genericParse);
    private headParser = createParser(HeadParser, this.genericParse);

    parse(xml: XMLElement): MsPart {
        const msIdentifierEl = xml.querySelector<XMLElement>('scope > msIdentifier');
        const msContentsEl = xml.querySelector<XMLElement>('scope > msContents');
        const physDescEl = xml.querySelector<XMLElement>('scope > physDesc');
        const msPartEl = xml.querySelector<XMLElement>('scope > msPart');
        const historyEl = xml.querySelector<XMLElement>('scope > history');
        const additionalEl = xml.querySelector<XMLElement>('scope > additional');
        const headEl = xml.querySelector<XMLElement>('scope > head');

        return {
            type: MsPart,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            msIdentifier: msIdentifierEl ? this.msIdentifierParser.parse(msIdentifierEl) : undefined,
            msContents: msContentsEl ? this.msContentsParser.parse(msContentsEl) : undefined,
            physDesc: physDescEl ? this.physDescParser.parse(physDescEl) : undefined,
            msPart : msPartEl ? this.parse(msPartEl) : undefined,
            history : historyEl ? this.historyParser.parse(historyEl) : undefined,
            additional: additionalEl ? this.additionalParser.parse(additionalEl) : undefined,
            head: headEl ? this.headParser.parse(headEl) : undefined,
        };
    }
}

export class MsFragParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private additionalParser = createParser(AdditionalParser, this.genericParse);
    private altIdentifierParser = createParser(AltIdentifierParser, this.genericParse);
    private historyParser = createParser(HistoryParser, this.genericParse);
    private msContentsParser = createParser(MsContentsParser, this.genericParse);
    private msIdentifierParser = createParser(MsIdentifierParser, this.genericParse);
    private physDescParser = createParser(PhysDescParser, this.genericParse);

    parse(xml: XMLElement): MsFrag {
        const additionalEl = xml.querySelector<XMLElement>('scope > additional');
        const altIdentifierEl = xml.querySelector<XMLElement>('scope > altIdentifier');
        const historyEl = xml.querySelector<XMLElement>('scope > history');
        const msContentsEl = xml.querySelector<XMLElement>('scope > msContents');
        const msIdentifierEl = xml.querySelector<XMLElement>('scope > msIdentifier');
        const physDescEl = xml.querySelector<XMLElement>('scope > physDesc');

        return {
            type: MsFrag,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            additional: additionalEl ? this.additionalParser.parse(additionalEl) : undefined,
            altIdentifier: altIdentifierEl ? this.altIdentifierParser.parse(altIdentifierEl) : undefined,
            history : historyEl ? this.historyParser.parse(historyEl) : undefined,
            msContents: msContentsEl ? this.msContentsParser.parse(msContentsEl) : undefined,
            msIdentifier: msIdentifierEl ? this.msIdentifierParser.parse(msIdentifierEl) : undefined,
            physDesc: physDescEl ? this.physDescParser.parse(physDescEl) : undefined,

        };
    }
}

export class MsDescParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private msIdentifierParser = createParser(MsIdentifierParser, this.genericParse);
    private msContentsParser = createParser(MsContentsParser, this.genericParse);
    private physDescParser = createParser(PhysDescParser, this.genericParse);
    private msPartParser = createParser(MsPartParser, this.genericParse);
    private historyParser = createParser(HistoryParser, this.genericParse);

    parse(xml: XMLElement): MsDesc {
        const msIdentifierEl = xml.querySelector<XMLElement>('scope > msIdentifier');
        const msContentsEl = xml.querySelector<XMLElement>('scope > msContents');
        const physDescEl = xml.querySelector<XMLElement>('scope > physDesc');
        const msPartEl = xml.querySelector<XMLElement>('scope > msPart');
        const historyEl = xml.querySelector<XMLElement>('scope > history');

        return {
            type: MsDesc,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            id: getID(xml),
            msIdentifier: msIdentifierEl ? this.msIdentifierParser.parse(msIdentifierEl) : undefined,
            msContents: msContentsEl ? this.msContentsParser.parse(msContentsEl) : undefined,
            physDesc: physDescEl ? this.physDescParser.parse(physDescEl) : undefined,
            msPart: msPartEl ? this.msPartParser.parse(msPartEl) : undefined,
            history: historyEl ? this.historyParser.parse(historyEl) : undefined,
        };
    }
}
