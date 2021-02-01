import { Type } from "@angular/core";
import { parse } from ".";
import { createParser, Parser } from "./parser-models";
import { Map } from '../../utils/js-utils';
import { ElementParser } from "./basic-parsers";

export class ParserRegister {
    private static PARSER_MAP: Map<Type<any>> = {};

    static setParser(tagName: string, parserType: Type<any>) {
        ParserRegister.PARSER_MAP[tagName] = parserType;
    }

    // tslint:disable-next-line: no-any
    static getParser<T>(tagName: string): Parser<T> {
        const name = ParserRegister.mapName(tagName)
        return createParser(ParserRegister.PARSER_MAP[name] || ElementParser, parse) as Parser<T>;
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
        ParserRegister.setParser(tagName, parserType);
    };
}
