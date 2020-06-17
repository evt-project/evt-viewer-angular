import { Comment, GenericElement, HTML, XMLElement } from '../../models/evt-models';
import { AppParser } from './app-parser';
import { ElementParser, LBParser, NoteParser, ParagraphParser, PtrParser, TextParser } from './basic-parsers';
import { CharParser, GlyphParser } from './characters-glyphs-parser';
import { GraphicParser, SurfaceParser, ZoneParser } from './facsimile-parser';
import {
    NamedEntityRefParser, OrganizationParser,
    PersonGroupParser, PersonParser, PlaceParser,
} from './named-entity-parsers';
import { createParser, Parser, ParseResult } from './parser-models';

type SupportedTagNames = 'app' | 'char' | 'event' | 'geogname' | 'glyph' | 'graphic' | 'lb' | 'note' | 'orgname' |
    'p' | 'persname' | 'placename' | 'ptr' | 'person' | 'personGrp' | 'place' | 'org' | 'surface' | 'zone';

export const parseF: { [T in SupportedTagNames]: Parser<XMLElement> } = {
    char: createParser(CharParser, parse),
    event: createParser(NamedEntityRefParser, parse),
    geogname: createParser(NamedEntityRefParser, parse),
    glyph: createParser(GlyphParser, parse),
    graphic: createParser(GraphicParser, parse),
    lb: createParser(LBParser, parse),
    note: createParser(NoteParser, parse),
    orgname: createParser(NamedEntityRefParser, parse),
    p: createParser(ParagraphParser, parse),
    persname: createParser(NamedEntityRefParser, parse),
    placename: createParser(NamedEntityRefParser, parse),
    ptr: createParser(PtrParser, parse),
    app: createParser(AppParser, parse),
    person: createParser(PersonParser, parse),
    personGrp: createParser(PersonGroupParser, parse),
    place: createParser(PlaceParser, parse),
    org: createParser(OrganizationParser, parse),
    // event: createParser(EventParser), // TODO: check event parser
    surface: createParser(SurfaceParser, parse),
    zone: createParser(ZoneParser, parse),
};

export function parse(xml: XMLElement): ParseResult<GenericElement> {
    if (!xml) { return { content: [xml] } as HTML; }
    // Text Node
    if (xml.nodeType === 3) { return createParser(TextParser, parse).parse(xml); }
    // Comment
    if (xml.nodeType === 8) { return {} as Comment; }
    const tagName = xml.tagName.toLowerCase();
    const parser: Parser<XMLElement> = parseF[tagName] || createParser(ElementParser, parse);

    return parser.parse(xml);
}
