import { MsContents, MsDesc, MsIdentifier, MsPart, PhysDesc, XMLElement } from '../../models/evt-models';
import { AttributeParser, EmptyParser } from './basic-parsers';
import { createParser, getClass, getID, parseChildren, Parser } from './parser-models';

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

    parse(xml: XMLElement): MsIdentifier {
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
        // TODO: Add specific parser when altIdentifier is handled
        const altIdentifier = Array.from(xml.querySelectorAll<XMLElement>(':scope > altIdentifier'))
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
            settlement,
            repository,
            idno,
            institution,
            altIdentifier,
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
    private msPartParser = createParser(MsPartParser, this.genericParse);

    parse(xml: XMLElement): MsPart {
        const msIdentifierEl = xml.querySelector<XMLElement>('scope > msIdentifier');
        const msContentsEl = xml.querySelector<XMLElement>('scope > msContents');
        const physDescEl = xml.querySelector<XMLElement>('scope > physDesc');
        const msPartEl = xml.querySelector<XMLElement>('scope > msPart');
        // TODO: Add specific parser when additional is handled
        const additional = Array.from(xml.querySelectorAll<XMLElement>(':scope > additional'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when history is handled
        const history = Array.from(xml.querySelectorAll<XMLElement>(':scope > history'))
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
            msPart : msPartEl ? this.msPartParser.parse(msPartEl) : undefined,
            additional,
            history,
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

    parse(xml: XMLElement): MsDesc {
        const msIdentifierEl = xml.querySelector<XMLElement>('scope > msIdentifier');
        const msContentsEl = xml.querySelector<XMLElement>('scope > msContents');
        const physDescEl = xml.querySelector<XMLElement>('scope > physDesc');
        const msPartEl = xml.querySelector<XMLElement>('scope > msPart');

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
        };
    }
}