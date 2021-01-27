import { AttributesMap } from 'ng-dynamic-component';
import {
    Addition, Attributes, Damage, Deletion, Gap, GenericElement, Lb, Note, NoteLayout,
    Paragraph, PlacementType, Supplied, Text, Verse, VersesGroup, Word, XMLElement,
} from '../../models/evt-models';
import { isNestedInElem, xpath } from '../../utils/dom-utils';
import { replaceMultispaces } from '../../utils/xml-utils';
import { createParser, getClass, getDefaultN, getID, parseChildren, ParseFn, Parser } from './parser-models';

export class EmptyParser {
    genericParse: ParseFn;
    constructor(parseFn: ParseFn) { this.genericParse = parseFn; }
}

export class AttrParser extends EmptyParser {
    protected attributeParser = createParser(AttributeParser, this.genericParse);
}

export function queryAndParseElements<T>(xml: XMLElement, name: string, p: Parser<HTMLElement>) {
    return Array.from(xml.querySelectorAll<XMLElement>(`:scope > ${name}`)).map(g => p.parse(g) as unknown as T);
}

export function queryAndParseElement<T>(xml: XMLElement, name: string, p: Parser<HTMLElement>): T {
    const el = xml.querySelector<XMLElement>(`:scope > ${name}`);

    return el && p.parse(el) as unknown as T;
}

export class GenericElemParser extends AttrParser implements Parser<XMLElement> {
    parse(xml: XMLElement): GenericElement {
        return {
            type: Object,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            // path?: string; // TODO: add path
        };
    }
}

export class AttributeParser extends EmptyParser implements Parser<XMLElement> {
    parse(data: HTMLElement): Attributes {
        return Array.from(data.attributes)
            .map(({ name, value }) => ({ [name === 'xml:id' ? 'id' : name.replace(':', '-')]: value }))
            .reduce((x, y) => ({ ...x, ...y }), {});
    }
}
export class AttributeMapParser extends EmptyParser implements Parser<XMLElement> {
    parse(xml: XMLElement) {
        const attributes: AttributesMap = {};
        Array.from(xml.attributes).forEach((attr) => {
            attributes[attr.name] = attr.value;
        });

        return attributes;
    }
}

export class TextParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Text {
        return {
            type: Text,
            text: replaceMultispaces(xml.textContent),
            attributes: {},
        } as Text;
    }
}

export class ParagraphParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    parse(xml: XMLElement): Paragraph {
        const attributes = this.attributeParser.parse(xml);
        const paragraphComponent: Paragraph = {
            type: Paragraph,
            content: parseChildren(xml, this.genericParse),
            attributes,
            n: getDefaultN(attributes.n),
        };

        return paragraphComponent;
    }
}

export class LBParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    parse(xml: XMLElement): Lb {
        const attributes = this.attributeParser.parse(xml);
        const { n, rend, facs } = attributes;

        return {
            id: getID(xml),
            n: getDefaultN(n),
            rend,
            facs,
            type: Lb,
            content: [],
            attributes,
        };
    }
}

export class ElementParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    parse(xml: XMLElement): GenericElement {
        const genericElement: GenericElement = {
            type: GenericElement,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
        };

        return genericElement;
    }
}

export class NoteParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    parse(xml: XMLElement): Note {
        const noteLayout: NoteLayout = this.isFooterNote(xml) || this.isNamedEntityNote(xml)
            || ['person', 'place', 'app'].some((v) => isNestedInElem(xml, v))
            ? 'plain-text'
            : 'popover';

        const noteType = !!xml.getAttribute('type') && isNestedInElem(xml, 'app')
            ? 'critical'
            : 'comment';

        const attributes = this.attributeParser.parse(xml);
        const noteElement = {
            type: Note,
            noteType,
            noteLayout,
            exponent: attributes.n,
            path: xpath(xml),
            content: parseChildren(xml, this.genericParse),
            attributes,
        };

        return noteElement;
    }

    private isFooterNote(xml: XMLElement) { return isNestedInElem(xml, 'div', [{ key: 'type', value: 'footer' }]); }
    private isNamedEntityNote(xml: XMLElement) { return isNestedInElem(xml, 'relation') || isNestedInElem(xml, 'event'); }
}

export class PtrParser extends EmptyParser implements Parser<XMLElement> {
    noteParser = createParser(NoteParser, this.genericParse);
    elementParser = createParser(ElementParser, this.genericParse);
    parse(xml: XMLElement): GenericElement {
        if (xml.getAttribute('type') === 'noteAnchor' && xml.getAttribute('target')) {
            const noteId = xml.getAttribute('target').replace('#', '');
            const rootNode = xml.closest('TEI');
            const noteEl = rootNode.querySelector<XMLElement>(`note[*|id="${noteId}"]`);

            return noteEl ? this.noteParser.parse(noteEl) : this.elementParser.parse(xml);
        }

        return this.elementParser.parse(xml);
    }
}

export class VerseParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    parse(xml: XMLElement): Verse {
        const attributes = this.attributeParser.parse(xml);
        const lineComponent: Verse = {
            type: Verse,
            content: parseChildren(xml, this.genericParse),
            attributes,
            n: getDefaultN(attributes.n),
        };

        return lineComponent;
    }
}

export class VersesGroupParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    parse(xml: XMLElement): VersesGroup {
        const attributes = this.attributeParser.parse(xml);
        const lgComponent: VersesGroup = {
            type: VersesGroup,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes,
            n: getDefaultN(attributes.n),
            groupType: getDefaultN(attributes.type),
        };

        return lgComponent;
    }
}

export class SuppliedParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    parse(xml: XMLElement): Supplied {
        const attributes = this.attributeParser.parse(xml);
        const { reason, source, resp } = attributes;

        return {
            type: Supplied,
            reason,
            source,
            resp,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes,
        };
    }
}

export class DamageParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    parse(xml: XMLElement): Damage {
        const attributes = this.attributeParser.parse(xml);
        const { agent, group, degree } = attributes;

        return {
            agent,
            group: parseInt(group, 10) ?? undefined,
            degree,
            type: Damage,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
        };
    }
}

export class GapParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    parse(xml: XMLElement): Gap {
        const attributes = this.attributeParser.parse(xml);
        const { reason, agent, quantity, unit, extent } = attributes;

        return {
            type: Gap,
            reason,
            agent,
            quantity: quantity ? parseInt(quantity, 10) : undefined,
            unit,
            extent,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes,
        };
    }
}

export class AdditionParser extends EmptyParser implements Parser<XMLElement> {
    elementParser = createParser(ElementParser, this.genericParse);
    attributeParser = createParser(AttributeParser, this.genericParse);
    parse(xml: XMLElement): Addition {
        return {
            type: Addition,
            place: xml.getAttribute('place') as PlacementType,
            path: xpath(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            class: xml.tagName.toLowerCase(),
        };
    }
}

export class WordParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    parse(xml: XMLElement): Word {
        const attributes = this.attributeParser.parse(xml);
        const { lemma } = attributes;

        return {
            type: Word,
            lemma,
            class: getClass(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
        };
    }
}

export class DeletionParser extends EmptyParser implements Parser<XMLElement> {
    elementParser = createParser(ElementParser, this.genericParse);
    attributeParser = createParser(AttributeParser, this.genericParse);
    parse(xml: XMLElement): Deletion {
        return {
            type: Deletion,
            rend: xml.getAttribute('rend'),
            path: xpath(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            class: xml.tagName.toLowerCase(),
        };
    }
}
