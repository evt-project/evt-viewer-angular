import { MsDesc, MsIdentifier, XMLElement } from '../../models/evt-models';
import { AttributeParser, EmptyParser } from './basic-parsers';
import { createParser, getClass, getID, parseChildren, Parser } from './parser-models';

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

export class MsDescParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private msIdentifierParser = createParser(MsIdentifierParser, this.genericParse);

    parse(xml: XMLElement): MsDesc {
        const msIdentifierEl = xml.querySelector<XMLElement>('scope > msIdentifier');
        // TODO: Add specific parser when msContensts is handled
        const msContents = Array.from(xml.querySelectorAll<XMLElement>(':scope > msContents'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when msPart is handled
        const msPart = Array.from(xml.querySelectorAll<XMLElement>(':scope > msPart'))
        .map(e => parseChildren(e, this.genericParse));
        // TODO: Add specific parser when physDesc is handled
        const physDesc = Array.from(xml.querySelectorAll<XMLElement>(':scope > physDesc'))
        .map(e => parseChildren(e, this.genericParse));

        return {
            type: MsDesc,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            id: getID(xml),
            msIdentifier: msIdentifierEl ? this.msIdentifierParser.parse(msIdentifierEl) : undefined,
            msContents,
            msPart,
            physDesc,
        };
    }
}
