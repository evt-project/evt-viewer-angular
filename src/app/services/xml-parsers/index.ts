import { Type } from '@angular/core';
import { Comment, GenericElement, HTML, XMLElement } from '../../models/evt-models';
import { Map } from '../../utils/js-utils';
import { createParser, Parser, ParseResult } from './parser-models';

export class ParserRegister {
    // tslint:disable-next-line: no-any
    private static PARSER_MAP: Map<Type<any>> = {};

    // tslint:disable-next-line: no-any
    static set(tagName: string, parserType: Type<any>) {
        ParserRegister.PARSER_MAP[tagName] = parserType;
    }

    static get<T>(tagName: string): Parser<T> {
        const name = ParserRegister.mapName(tagName);

        return createParser(ParserRegister.PARSER_MAP[name], parse) as Parser<T>;
    }

    private static mapName(tagName) {
        if (!Object.keys(ParserRegister.PARSER_MAP).includes(tagName)) {
            return 'evt-generic-elem-parser';
        }

        const nes = ['event', 'geogname', 'orgname', 'persname', 'placename'];
        if (nes.includes(tagName)) {
            return 'evt-named-entity-parser';
        }
        const crit = ['rdg', 'lem'];
        if (crit.includes(tagName)) {
            return 'rdg';
        }

        return tagName;
    }
}

// tslint:disable-next-line: no-any
export function xmlParser(tagName: string, parserType: Type<any>) {

    // tslint:disable-next-line: no-any
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
