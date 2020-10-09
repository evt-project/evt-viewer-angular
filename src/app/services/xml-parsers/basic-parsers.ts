import { AttributesMap } from 'ng-dynamic-component';
import { Attributes, GenericElement, Lb, Note, NoteLayout, Paragraph, Supplied, Text, Verse, XMLElement } from '../../models/evt-models';
import { isNestedInElem, xpath } from '../../utils/dom-utils';
import { replaceMultispaces } from '../../utils/xml-utils';
import { createParser, getClass, getDefaultN, getID, parseChildren, ParseFn, Parser } from './parser-models';

export class EmptyParser {
    genericParse: ParseFn;
    constructor(parseFn: ParseFn) { this.genericParse = parseFn; }
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
