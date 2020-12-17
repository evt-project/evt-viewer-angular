import {
    AccMat, Acquisition, Additional, Additions, AltIdentifier, BindingDesc, DecoDesc, HandDesc, Head, History, Institution, MsContents,
    MsDesc, MsFrag, MsIdentifier, MsItem, MsItemStruct, MsName, MsPart, MusicNotation, ObjectDesc, Origin, PhysDesc, Provenance, Repository,
    ScriptDesc, SealDesc, Summary, TypeDesc, XMLElement,
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

export class OriginParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): Origin {
        const attributes = this.attributeParser.parse(xml);
        const { notBefore, notAfter, evidence, resp } = attributes;
        // TODO: Add specific parser when originDate is handled
        const originDate = Array.from(xml.querySelectorAll<XMLElement>(':scope > originDate'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when originPlace is handled
        const originPlace = Array.from(xml.querySelectorAll<XMLElement>(':scope > originPlace'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: Origin,
            content: parseChildren(xml, this.genericParse),
            attributes,
            notBefore,
            notAfter,
            evidence,
            resp,
            originDate,
            originPlace,
        };
    }
}

export class ProvenanceParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): Provenance {
        const attributes = this.attributeParser.parse(xml);
        const { when } = attributes;
        // TODO: Add specific parser when name is handled
        const name = Array.from(xml.querySelectorAll<XMLElement>(':scope > name'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when foreign is handled
        const foreign = Array.from(xml.querySelectorAll<XMLElement>(':scope > foreign'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: Acquisition,
            content: parseChildren(xml, this.genericParse),
            attributes,
            when,
            name,
            foreign,
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

export class ObjectDescParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): ObjectDesc {
        const attributes = this.attributeParser.parse(xml);
        const { form } = attributes;
        // TODO: Add specific parser when layoutDesc is handled
        const layoutDesc = Array.from(xml.querySelectorAll<XMLElement>(':scope > layoutDesc'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when supportDesc is handled
        const supportDesc = Array.from(xml.querySelectorAll<XMLElement>(':scope > supportDesc'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: ObjectDesc,
            content: parseChildren(xml, this.genericParse),
            attributes,
            form,
            layoutDesc,
            supportDesc,
        };
    }
}

export class BindingDescParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): BindingDesc {
        // TODO: Add specific parser when binding is handled
        const binding = Array.from(xml.querySelectorAll<XMLElement>(':scope > binding'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when condition is handled
        const condition = Array.from(xml.querySelectorAll<XMLElement>(':scope > condition'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when decoNote is handled
        const decoNote = Array.from(xml.querySelectorAll<XMLElement>(':scope > decoNote'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: BindingDesc,
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            binding,
            condition,
            decoNote,
        };
    }
}

export class DecoDescParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): DecoDesc {
        // TODO: Add specific parser when decoNote is handled
        const decoNote = Array.from(xml.querySelectorAll<XMLElement>(':scope > decoNote'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: DecoDesc,
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            decoNote,
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

export class SealDescParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): SealDesc {
        // TODO: Add specific parser when seal is handled
        const seal = Array.from(xml.querySelectorAll<XMLElement>(':scope > seal'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: SealDesc,
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            seal,
        };
    }
}

export class TypeDescParser extends EmptyParser implements Parser<XMLElement> {
    private summaryParser = createParser(SummaryParser, this.genericParse);
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): TypeDesc {
        const summaryEl = xml.querySelector<XMLElement>('scope > summary');
        // TODO: Add specific parser when typeNote is handled
        const typeNote = Array.from(xml.querySelectorAll<XMLElement>(':scope > typeNote'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: SealDesc,
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            summary: summaryEl ? this.summaryParser.parse(summaryEl) : undefined,
            typeNote,
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

export class MsItemParser extends EmptyParser implements Parser<XMLElement> {
    private noteParser = createParser(NoteParser, this.genericParse);
    private gapParser = createParser(GapParser, this.genericParse);
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): MsItem {
        const attributes = this.attributeParser.parse(xml);
        const noteEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > note')).map(n => this.noteParser.parse(n));
        const gapEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > gap')).map(g => this.gapParser.parse(g));
        // TODO: Add specific parser when author is handled
        const author = Array.from(xml.querySelectorAll<XMLElement>(':scope > author'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when title is handled
        const title = Array.from(xml.querySelectorAll<XMLElement>(':scope > title'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when rubric is handled
        const rubric = Array.from(xml.querySelectorAll<XMLElement>(':scope > rubric'))
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
        // TODO: Add specific parser when locus is handled
        const locus = Array.from(xml.querySelectorAll<XMLElement>(':scope > locus'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when locusGrp is handled
        const locusGrp = Array.from(xml.querySelectorAll<XMLElement>(':scope > locusGrp'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when bibl is handled
        const bibl = Array.from(xml.querySelectorAll<XMLElement>(':scope > bibl'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when incipit is handled
        const incipit = Array.from(xml.querySelectorAll<XMLElement>(':scope > incipit'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when explicit is handled
        const explicit = Array.from(xml.querySelectorAll<XMLElement>(':scope > explicit'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when filiation is handled
        const filiation = Array.from(xml.querySelectorAll<XMLElement>(':scope > filiation'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: MsItem,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes,
            n: getDefaultN(attributes.n),
            defective: true || false,
            noteEl,
            gapEl,
            author,
            title,
            rubric,
            textLang,
            docAuthor,
            docTitle,
            docImprint,
            docDate,
            locus,
            locusGrp,
            bibl,
            incipit,
            explicit,
            filiation,
        };
    }
}

export class MsItemStructParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): MsItemStruct {
        const attributes = this.attributeParser.parse(xml);
        // TODO: Add specific parser when author is handled
        const author = Array.from(xml.querySelectorAll<XMLElement>(':scope > author'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when title is handled
        const title = Array.from(xml.querySelectorAll<XMLElement>(':scope > title'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when rubric is handled
        const rubric = Array.from(xml.querySelectorAll<XMLElement>(':scope > rubric'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when locus is handled
        const locus = Array.from(xml.querySelectorAll<XMLElement>(':scope > locus'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when bibl is handled
        const bibl = Array.from(xml.querySelectorAll<XMLElement>(':scope > bibl'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when finalRubric is handled
        const finalRubric = Array.from(xml.querySelectorAll<XMLElement>(':scope > finalRubric'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: MsItemStruct,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes,
            n: getDefaultN(attributes.n),
            defective: true || false,
            author,
            title,
            rubric,
            locus,
            finalRubric,
            bibl,
        };
    }
}

export class AdditionalParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): Additional {
        // TODO: Add specific parser when listBibl is handled
        const listBibl = Array.from(xml.querySelectorAll<XMLElement>(':scope > listBibl'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when adminInfo is handled
        const adminInfo = Array.from(xml.querySelectorAll<XMLElement>(':scope > adminInfo'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when surrogates is handled
        const surrogates = Array.from(xml.querySelectorAll<XMLElement>(':scope > surrogates'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: Summary,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            listBibl,
            adminInfo,
            surrogates,
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

export class  AltIdentifierParser extends EmptyParser implements Parser<XMLElement> {
    private noteParser = createParser(NoteParser, this.genericParse);
    private repositoryParser = createParser(RepositoryParser, this.genericParse);
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): AltIdentifier {
        const repositoryEl = xml.querySelector<XMLElement>('scope > repository');
        const noteEl = Array.from(xml.querySelectorAll<XMLElement>(':scope > note')).map(n => this.noteParser.parse(n));
        // TODO: Add specific parser when idno is handled
        const idno = Array.from(xml.querySelectorAll<XMLElement>(':scope > idno'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when collection is handled
        const collection = Array.from(xml.querySelectorAll<XMLElement>(':scope > collection'))
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
            collection,
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

    parse(xml: XMLElement): MsIdentifier {
        const altIdentifierEl = xml.querySelector<XMLElement>('scope > altIdentifier');
        const msNameEl = xml.querySelector<XMLElement>('scope > msName');
        const repositoryEl = xml.querySelector<XMLElement>('scope > repository');
        const institutionEl = xml.querySelector<XMLElement>('scope > institution');
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
