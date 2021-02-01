import { Comment, GenericElement, HTML, XMLElement } from '../../models/evt-models';
import { TextParser } from './basic-parsers';
import { createParser, Parser, ParseResult } from './parser-models';
import { ParserRegister } from './parser-register';

export function parse(xml: XMLElement): ParseResult<GenericElement> {
    if (!xml) { return { content: [xml] } as HTML; }
    // Text Node
    if (xml.nodeType === 3) { return createParser(TextParser, parse).parse(xml); }
    // Comment
    if (xml.nodeType === 8) { return {} as Comment; }
    const tagName = xml.tagName.toLowerCase();
    const parser: Parser<XMLElement> = ParserRegister.getParser(tagName);

    return parser.parse(xml);
}
