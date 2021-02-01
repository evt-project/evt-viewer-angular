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
        return createParser(ParserRegister.PARSER_MAP[tagName] || ElementParser, parse) as Parser<T>;
    }
}

// tslint:disable-next-line: no-any
export function xmlParser(tagName: string, parserType: Type<any>) {
    // tslint:disable-next-line: no-any
    return (_: Type<any>) => {
        ParserRegister.setParser(tagName, parserType);
    };
}
