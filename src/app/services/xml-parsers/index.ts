import { Type } from '@angular/core';
import { Comment, GenericElement, HTML, XMLElement } from '../../models/evt-models';
import { Map } from '../../utils/js-utils';
import { createParser, Parser, ParseResult } from './parser-models';

export class ParserRegister {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static PARSER_MAP: Map<Type<any>> = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static set(tagName: string, parserType: Type<any>) {
        ParserRegister.PARSER_MAP[tagName.toLowerCase()] = parserType;
    }

    static get<T>(tagName: string): Parser<T> {
        const name = ParserRegister.mapName(tagName.toLowerCase());

        return createParser(ParserRegister.PARSER_MAP[name], parse) as Parser<T>;
    }

    private static mapName(tagName) {
        const nes = ['event', 'geogname', 'orgname', 'persname', 'placename'];
        if (nes.includes(tagName)) {
            return 'evt-named-entity-parser';
        }
        const nels = ['listPerson', 'listPlace', 'listOrg', 'listEvent'];
        if (nels.includes(tagName)) {
            return 'evt-named-entities-list-parser';
        }
        const quote = ['quote'];
        if (quote.includes(tagName)) {
            return 'evt-quote-entry-parser';
        }
        const crit = ['app'];
        if (crit.includes(tagName)) {
            return 'evt-apparatus-entry-parser';
        }
        if (!Object.keys(ParserRegister.PARSER_MAP).includes(tagName)) {
            return 'evt-generic-elem-parser';
        }

        return tagName;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function xmlParser(tagName: string, parserType: Type<any>) {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (_: Type<any>) => {
        ParserRegister.set(tagName, parserType);
    };
}

export function parse(xml: XMLElement): ParseResult<GenericElement> {
    if (!xml) { return { content: [xml] } as HTML; }
    // Text Node
    if (xml.nodeType === 3) { return ParserRegister.get('evt-text-parser').parse(xml); }
    // Comment
    if (xml.nodeType === 8) { return {} as Comment; }
    const tagName = xml.tagName.toLowerCase();
    const parser: Parser<XMLElement> = ParserRegister.get(tagName);

    return parser.parse(xml);
}
