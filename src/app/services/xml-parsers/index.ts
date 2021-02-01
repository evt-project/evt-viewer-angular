import { Comment, GenericElement, HTML, XMLElement } from '../../models/evt-models';
import { createParser, Parser, ParseResult } from './parser-models';
import { Type } from '@angular/core';
import { Map } from '../../utils/js-utils';

export class ParserRegister {
    private static PARSER_MAP: Map<Type<any>> = {};

    static set(tagName: string, parserType: Type<any>) {
        console.log('Set parser ', tagName, parserType)
        ParserRegister.PARSER_MAP[tagName] = parserType;
    }

    // tslint:disable-next-line: no-any
    static get<T>(tagName: string): Parser<T> {
        const name = ParserRegister.mapName(tagName) || 'evt-elemet-paraser';
        console.log('GetParser for ', tagName, ' got ', name)
        return createParser(ParserRegister.PARSER_MAP[name], parse) as Parser<T>;
    }

    private static mapName(tagName) {
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
        console.log('decorator set', tagName, parserType)
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
