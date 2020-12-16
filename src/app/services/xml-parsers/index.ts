import { Comment, GenericElement, HTML, XMLElement } from '../../models/evt-models';
import { AppParser, RdgParser } from './app-parser';
import {
    AdditionParser, DamageParser, DeletionParser, ElementParser, GapParser, LBParser, NoteParser, ParagraphParser,
    PtrParser, SuppliedParser, TextParser, VerseParser, VersesGroupParser, WordParser,
} from './basic-parsers';
import { CharParser, GlyphParser, GParser } from './character-declarations-parser';
import { ChoiceParser } from './choice-parser';
import { SicParser, SurplusParser } from './editorial-parsers';
import { GraphicParser, SurfaceParser, ZoneParser } from './facsimile-parser';
import {
    AcquisitionParser, AltIdentifierParser, HistoryParser, MsContentsParser, MsDescParser, MsIdentifierParser,
    MsItemParser, MsItemStructParser, MsPartParser, PhysDescParser,
} from './msdesc-parser';
import {
    NamedEntityRefParser, OrganizationParser,
    PersonGroupParser, PersonParser, PlaceParser,
} from './named-entity-parsers';
import { createParser, Parser, ParseResult } from './parser-models';

type SupportedTagNames = 'add' | 'altIdentifier' | 'app' | 'acquisition' | 'char' | 'choice' | 'damage' | 'del' | 'event' | 'g' | 'gap' | 'geogname' | 'glyph' | 'graphic' |
    'history' | 'l' | 'lb' | 'lem' | 'lg' | 'msContents' | 'msDesc' | 'msIdentifier' | 'msItem' | 'msItemStruct' | 'msPart' | 'note' | 'orgname' | 'p' | 'persname' | 'physDesc' | 'placename' | 'ptr' | 'person' |
    'personGrp' | 'place' | 'org' | 'rdg' | 'sic' | 'surface' | 'supplied' | 'surplus' | 'w' | 'zone';

export const parseF: { [T in SupportedTagNames]: Parser<XMLElement> } = {
    acquisition: createParser(AcquisitionParser, parse),
    add: createParser(AdditionParser, parse),
    altIdentifier: createParser(AltIdentifierParser, parse),
    app: createParser(AppParser, parse),
    char: createParser(CharParser, parse),
    choice: createParser(ChoiceParser, parse),
    damage: createParser(DamageParser, parse),
    del: createParser(DeletionParser, parse),
    event: createParser(NamedEntityRefParser, parse),
    g: createParser(GParser, parse),
    gap: createParser(GapParser, parse),
    geogname: createParser(NamedEntityRefParser, parse),
    glyph: createParser(GlyphParser, parse),
    graphic: createParser(GraphicParser, parse),
    history: createParser(HistoryParser, parse),
    l: createParser(VerseParser, parse),
    lb: createParser(LBParser, parse),
    lg: createParser(VersesGroupParser, parse),
    lem: createParser(RdgParser, parse),
    msContents: createParser(MsContentsParser, parse),
    msDesc: createParser(MsDescParser, parse),
    msIdentifier: createParser(MsIdentifierParser, parse),
    msItem: createParser(MsItemParser, parse),
    msItemStruct : createParser(MsItemStructParser, parse),
    msPart: createParser(MsPartParser, parse),
    note: createParser(NoteParser, parse),
    org: createParser(OrganizationParser, parse),
    orgname: createParser(NamedEntityRefParser, parse),
    p: createParser(ParagraphParser, parse),
    persname: createParser(NamedEntityRefParser, parse),
    physDesc: createParser(PhysDescParser, parse),
    placename: createParser(NamedEntityRefParser, parse),
    ptr: createParser(PtrParser, parse),
    person: createParser(PersonParser, parse),
    personGrp: createParser(PersonGroupParser, parse),
    place: createParser(PlaceParser, parse),
    rdg: createParser(RdgParser, parse),
    // event: createParser(EventParser), // TODO: check event parser
    sic: createParser(SicParser, parse),
    surface: createParser(SurfaceParser, parse),
    supplied: createParser(SuppliedParser, parse),
    surplus: createParser(SurplusParser, parse),
    w: createParser(WordParser, parse),
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
