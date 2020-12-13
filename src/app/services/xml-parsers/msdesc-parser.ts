import { AltIdentifier, History, MsContents, MsDesc, MsIdentifier, MsItem, MsItemStruct, MsPart, PhysDesc, XMLElement } from '../../models/evt-models';
import { AttributeParser, EmptyParser, GapParser, NoteParser } from './basic-parsers';
import { createParser, getClass, getDefaultN, getID, parseChildren, Parser } from './parser-models';

export class HistoryParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): History {
        // TODO: Add specific parser when acquisition is handled
        const acquisition = Array.from(xml.querySelectorAll<XMLElement>(':scope > acquisition'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when origin is handled
        const origin = Array.from(xml.querySelectorAll<XMLElement>(':scope > origin'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when provenance is handled
        const provenance = Array.from(xml.querySelectorAll<XMLElement>(':scope > provenance'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when summary is handled
        const summary = Array.from(xml.querySelectorAll<XMLElement>(':scope > summary'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: History,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            acquisition,
            origin,
            provenance,
            summary,
        };
    }
}

export class PhysDescParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): PhysDesc {
        // TODO: Add specific parser when objectDesc is handled
        const objectDesc = Array.from(xml.querySelectorAll<XMLElement>(':scope > objectDesc'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when bindingDesc is handled
        const bindingDesc = Array.from(xml.querySelectorAll<XMLElement>(':scope > bindingDesc'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when decoDesc is handled
        const decoDesc = Array.from(xml.querySelectorAll<XMLElement>(':scope > decoDesc'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when handDesc is handled
        const handDesc = Array.from(xml.querySelectorAll<XMLElement>(':scope > handDesc'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when accMat is handled
        const accMat = Array.from(xml.querySelectorAll<XMLElement>(':scope > accMat'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when additions is handled
        const additions = Array.from(xml.querySelectorAll<XMLElement>(':scope > additions'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when musicNotation is handled
        const musicNotation = Array.from(xml.querySelectorAll<XMLElement>(':scope > musicNotation'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when scriptDesc is handled
        const scriptDesc = Array.from(xml.querySelectorAll<XMLElement>(':scope > scriptDesc'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when sealDesc is handled
        const sealDesc = Array.from(xml.querySelectorAll<XMLElement>(':scope > sealDesc'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when typeDesc is handled
        const typeDesc = Array.from(xml.querySelectorAll<XMLElement>(':scope > typeDesc'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: PhysDesc,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            objectDesc,
            bindingDesc,
            decoDesc,
            handDesc,
            accMat,
            additions,
            musicNotation,
            scriptDesc,
            sealDesc,
            typeDesc,
        };
    }
}

export class MsContentsParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): MsContents {
        // TODO: Add specific parser when summary is handled
        const summary = Array.from(xml.querySelectorAll<XMLElement>(':scope > summary'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when msItem is handled
        const msItem = Array.from(xml.querySelectorAll<XMLElement>(':scope > msItem'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when idno is handled
        const msItemStruct = Array.from(xml.querySelectorAll<XMLElement>(':scope > msItemStruct'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: MsContents,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            summary,
            msItem,
            msItemStruct,
        };
    }
}

export class MsIdentifierParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private altIdentifierParser = createParser(AltIdentifierParser, this.genericParse);

    parse(xml: XMLElement): MsIdentifier {
        const altIdentifierEl = xml.querySelector<XMLElement>('scope > altIdentifier');
        // TODO: Add specific parser when settlement is handled
        const settlement = Array.from(xml.querySelectorAll<XMLElement>(':scope > settlement'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when repository is handled
        const repository = Array.from(xml.querySelectorAll<XMLElement>(':scope > repository'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when idno is handled
        const idno = Array.from(xml.querySelectorAll<XMLElement>(':scope > idno'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when institution is handled
        const institution = Array.from(xml.querySelectorAll<XMLElement>(':scope > institution'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when msName is handled
        const msName = Array.from(xml.querySelectorAll<XMLElement>(':scope > msName'))
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
            repository,
            idno,
            institution,
            altIdentifier: altIdentifierEl ? this.altIdentifierParser.parse(altIdentifierEl) : undefined,
            msName,
            country,
            region,
        };
    }
}

export class MsPartParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private msIdentifierParser = createParser(MsIdentifierParser, this.genericParse);
    private msContentsParser = createParser(MsContentsParser, this.genericParse);
    private physDescParser = createParser(PhysDescParser, this.genericParse);
    private historyParser = createParser(HistoryParser, this.genericParse);

    parse(xml: XMLElement): MsPart {
        const msIdentifierEl = xml.querySelector<XMLElement>('scope > msIdentifier');
        const msContentsEl = xml.querySelector<XMLElement>('scope > msContents');
        const physDescEl = xml.querySelector<XMLElement>('scope > physDesc');
        const msPartEl = xml.querySelector<XMLElement>('scope > msPart');
        const historyEl = xml.querySelector<XMLElement>('scope > history');
        // TODO: Add specific parser when additional is handled
        const additional = Array.from(xml.querySelectorAll<XMLElement>(':scope > additional'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when head is handled
        const head = Array.from(xml.querySelectorAll<XMLElement>(':scope > head'))
        .map(e => parseChildren(e, this.genericParse));

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
            additional,
            head,
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
            msPart : msPartEl ? this.msPartParser.parse(msPartEl) : undefined,
            history :historyEl ? this.historyParser.parse(historyEl) : undefined,
        };
    }
}

export class  AltIdentifierParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    parse(xml: XMLElement): AltIdentifier {
        // TODO: Add specific parser when note is handled
        const note = Array.from(xml.querySelectorAll<XMLElement>(':scope > note'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when idno is handled
        const idno = Array.from(xml.querySelectorAll<XMLElement>(':scope > idno'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when collection is handled
        const collection = Array.from(xml.querySelectorAll<XMLElement>(':scope > collection'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when repository is handled
        const repository = Array.from(xml.querySelectorAll<XMLElement>(':scope > repository'))
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
            note,
            idno,
            collection,
            repository,
            region,
            settlement,
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
            attributes: this.attributeParser.parse(xml),
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
            type: AltIdentifier,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
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