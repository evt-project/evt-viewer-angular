import { xmlParser } from '.';
import { Char, CharMapping, CharProp, G, Graphic, XMLElement } from '../../models/evt-models';
import { AttributeParser, EmptyParser } from './basic-parsers';
import { GraphicParser } from './facsimile-parser';
import { createParser, getDefaultAttr, getID, parseChildren, Parser } from './parser-models';

@xmlParser('char', CharParser)
export class CharParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    public parse(xml: XMLElement): Char {
        return {
            type: Char,
            id: getID(xml),
            attributes: this.attributeParser.parse(xml),
            content: parseChildren(xml, this.genericParse),
            name: this.getName(xml),
            entityName: this.getEntityName(xml),
            mappings: this.getMappings(xml),
            localProps: this.getLocalProps(xml),
            graphics: this.graphicsParser(xml),
        };
    }

    getName(xml: XMLElement) {
        const charNameEl = xml.querySelector<XMLElement>('charName');
        if (charNameEl) {
            return charNameEl.textContent;
        }
        const localPropName = Array.from(xml.querySelectorAll<XMLElement>('localProp'))
            .find(el => getDefaultAttr(el.getAttribute('name')).toLowerCase() === 'name');

        return localPropName ? getDefaultAttr(localPropName.getAttribute('value')) : '';
    }

    getEntityName(xml: XMLElement) {
        const localPropName = Array.from(xml.querySelectorAll<XMLElement>('localProp'))
            .find(el => getDefaultAttr(el.getAttribute('name')).toLowerCase() === 'entity');

        return localPropName ? getDefaultAttr(localPropName.getAttribute('value')) : '';
    }

    getMappings(xml: XMLElement): CharMapping[] {
        return Array.from(xml.querySelectorAll<XMLElement>('mapping'))
            .map(el => ({
                type: getDefaultAttr(el.getAttribute('type')),
                subtype: getDefaultAttr(el.getAttribute('subtype')),
                attributes: this.attributeParser.parse(el),
                content: parseChildren(el, this.genericParse),
            }));
    }

    getLocalProps(xml: XMLElement): CharProp[] {
        return Array.from(xml.querySelectorAll<XMLElement>('localProp'))
            .map(el => ({
                name: getDefaultAttr(el.getAttribute('name')),
                value: getDefaultAttr(el.getAttribute('value')),
            }));
    }

    graphicsParser(xml: XMLElement): Graphic[] {
        const graphicParser = createParser(GraphicParser, this.genericParse);

        return Array.from(xml.querySelectorAll<XMLElement>('graphic'))
            .map(el => graphicParser.parse(el));
    }
}

@xmlParser('glyph', GlyphParser)
export class GlyphParser extends CharParser implements Parser<XMLElement> {

    public parse(xml: XMLElement): Char {
        return {
            type: Char,
            id: getID(xml),
            attributes: this.attributeParser.parse(xml),
            content: parseChildren(xml, this.genericParse),
            name: this.getName(xml),
            entityName: this.getEntityName(xml),
            mappings: this.getMappings(xml),
            localProps: this.getLocalProps(xml),
            graphics: this.graphicsParser(xml),
        };
    }

    getName(xml: XMLElement) {
        const charNameEl = xml.querySelector<XMLElement>('glyphName');
        if (charNameEl) {
            return charNameEl.textContent;
        }
        const localPropName = Array.from(xml.querySelectorAll<XMLElement>('localProp'))
            .find(el => getDefaultAttr(el.getAttribute('name')).toLowerCase() === 'name');

        return localPropName ? getDefaultAttr(localPropName.getAttribute('value')) : '';
    }
}

@xmlParser('g', GParser)
export class GParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    public parse(xml: XMLElement): G {
        return {
            type: G,
            id: getID(xml),
            attributes: this.attributeParser.parse(xml),
            content: parseChildren(xml, this.genericParse),
            charId: getDefaultAttr(xml.getAttribute('ref')).replace('#', ''),
        };
    }

}
