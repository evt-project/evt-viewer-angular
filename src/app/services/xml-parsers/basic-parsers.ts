import { AttributesMap } from 'ng-dynamic-component';
import { ParserRegister, xmlParser } from '.';
import {
    Addition, Analogue, Attributes, Damage, Deletion, Gap, GenericElement, Lb, Note, NoteLayout,
    Paragraph, PlacementType, Ptr, QuoteEntry, Supplied, Term, Text, Verse, VersesGroup, Word, XMLElement,
} from '../../models/evt-models';
import { isNestedInElem, xpath } from '../../utils/dom-utils';
import { getExternalElements, replaceMultispaces } from '../../utils/xml-utils';
import { createParser, getClass, getDefaultN, getID, parseChildren, ParseFn, Parser } from './parser-models';
import { AppConfig } from 'src/app/app.config';
import { AnalogueParser } from './analogue-parser';
import { QuoteParser } from './quotes-parser';

export class EmptyParser {
    genericParse: ParseFn;
    constructor(parseFn: ParseFn) { this.genericParse = parseFn; }
}

export class AttrParser extends EmptyParser {
    protected attributeParser = createParser(AttributeParser, this.genericParse);
}

export function queryAndParseElements<T>(xml: XMLElement, name: string) {
    const p = ParserRegister.get(name);

    return Array.from(xml.querySelectorAll<XMLElement>(`:scope > ${name}`)).map((g) => p.parse(g) as unknown as T);
}

export function queryAndParseElement<T>(xml: XMLElement, name: string, allAnnidationLevels?: boolean): T {
    const el = xml.querySelector<XMLElement>(`${allAnnidationLevels ? '' : ':scope > '}${name}`);
    const p = ParserRegister.get(name);

    return el && p.parse(el) as unknown as T;
}

export function parseElement<T>(xml: XMLElement): T {
    const p = ParserRegister.get(xml.tagName);

    return xml && p.parse(xml) as unknown as T;
}

@xmlParser('evt-generic-elem-parser', GenericElemParser)
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

export class GenericParser extends GenericElemParser {
    protected genericElemParser = createParser(GenericElemParser, this.genericParse);
}

@xmlParser('evt-attribute-parser', AttributeParser)
export class AttributeParser extends EmptyParser implements Parser<XMLElement> {
    parse(data: HTMLElement): Attributes {
        return Array.from(data.attributes)
            .map(({ name, value }) => ({ [name === 'xml:id' ? 'id' : name.replace(':', '-')]: value }))
            .reduce((x, y) => ({ ...x, ...y }), {});
    }
}

@xmlParser('attribute-map-parser', AttributeMapParser)
export class AttributeMapParser extends EmptyParser implements Parser<XMLElement> {
    parse(xml: XMLElement) {
        const attributes: AttributesMap = {};
        Array.from(xml.attributes).forEach((attr) => {
            attributes[attr.name] = attr.value;
        });

        return attributes;
    }
}

@xmlParser('evt-text-parser', TextParser)
export class TextParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Text {
        return {
            type: Text,
            text: replaceMultispaces(xml.textContent),
            attributes: {},
        } as Text;
    }
}

@xmlParser('p', ParagraphParser)
export class ParagraphParser extends EmptyParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Paragraph {
        const attributes = ParserRegister.get('evt-attribute-parser').parse(xml) as Attributes;
        const paragraphComponent: Paragraph = {
            type: Paragraph,
            content: parseChildren(xml, this.genericParse),
            attributes,
            n: getDefaultN(attributes.n),
        };

        return paragraphComponent;
    }
}

@xmlParser('lb', LBParser)
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

@xmlParser('note', NoteParser)
export class NoteParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    parse(xml: XMLElement): Note {
        const noteLayout: NoteLayout = this.isFooterNote(xml) || this.isNamedEntityNote(xml)
            || ['person', 'place', 'app', 'msDesc'].some((v) => isNestedInElem(xml, v))
            ? 'plain-text'
            : 'popover';

        const noteType = !xml.getAttribute('type') && isNestedInElem(xml, 'app')
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

@xmlParser('ptr', PtrParser)
export class PtrParser extends GenericElemParser implements Parser<XMLElement> {
    noteParser = createParser(NoteParser, this.genericParse);
    elementParser = createParser(GenericElemParser, this.genericParse);
    analogueParser = createParser(AnalogueParser, this.genericParse);
    quoteParser = createParser(QuoteParser, this.genericParse);
    sourceAttr = AppConfig.evtSettings.edition.externalBibliography.biblAttributeToMatch
    ptrAttrs = AppConfig.evtSettings.edition.externalBibliography.elementAttributesToMatch;

    parse(xml: XMLElement): Ptr | Note | GenericElement | Analogue | QuoteEntry {

        // if ptr refers to an analogue passage
        if (this.isAnalogue(xml)) {
            return this.analogueParser.parse(xml);
        }

        // note
        if (xml.getAttribute('type') === 'noteAnchor' && xml.getAttribute('target')) {
            const noteId = xml.getAttribute('target').replace('#', '');
            const rootNode = xml.closest('TEI');
            const noteEl = rootNode.querySelector<XMLElement>(`note[*|id="${noteId}"]`);

            return noteEl ? this.noteParser.parse(noteEl) : this.elementParser.parse(xml);
        }

        // is it a source entry?
        if (this.isSource) {
            return this.quoteParser.parse(xml);
        }

        return {
            ...super.parse(xml),
            type: Ptr,
            id: getID(xml),
            target: xml.getAttribute('target'),
            cRef: xml.getAttribute('cRef'),
            ptrType: xml.getAttribute('ptrType'),
            rend: xml.getAttribute('rend'),
        };
    }

    private isAnalogue(xml: XMLElement) { return (AppConfig.evtSettings.edition.analogueMarkers.includes(xml.getAttribute('type'))) };
    private isSource(xml: XMLElement) { return (getExternalElements(xml, this.ptrAttrs, this.sourceAttr, 'bibl, cit, note, seg')).length !== 0 }
}

@xmlParser('l', VerseParser)
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

@xmlParser('lg', VersesGroupParser)
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

@xmlParser('supplied', SuppliedParser)
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

@xmlParser('damage', DamageParser)
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

@xmlParser('gap', GapParser)
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

@xmlParser('add', AdditionParser)
export class AdditionParser extends EmptyParser implements Parser<XMLElement> {
    elementParser = createParser(GenericElemParser, this.genericParse);
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

@xmlParser('w', WordParser)
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

@xmlParser('del', DeletionParser)
export class DeletionParser extends EmptyParser implements Parser<XMLElement> {
    elementParser = createParser(GenericElemParser, this.genericParse);
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

@xmlParser('term', TermParser)
export class TermParser extends GenericElemParser implements Parser<XMLElement> {
    parse(xml: XMLElement): Term {
        return {
            ...super.parse(xml),
            type: Term,
            id: xml.getAttribute('xml:id'),
            ref: xml.getAttribute('ref'),
            rend: xml.getAttribute('rend'),
        };
    }
}
