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
    AcquisitionParser, AltIdentifierParser, BindingDescParser, DecoDescParser, HandDescParser, HistoryParser, MsContentsParser,
    MsDescParser, MsIdentifierParser, MsItemParser, MsItemStructParser, MsPartParser, MusicNotationParser, ObjectDescParser,
    OriginParser, PhysDescParser, ProvenanceParser, ScriptDescParser, SealDescParser, SummaryParser, TypeDescParser,
} from './msdesc-parser';
import {
    NamedEntityRefParser, OrganizationParser,
    PersonGroupParser, PersonParser, PlaceParser,
} from './named-entity-parsers';
import { createParser, Parser, ParseResult } from './parser-models';

type SupportedTagNames = 'add' | 'altIdentifier' | 'app' | 'acquisition' | 'bindingDesc' | 'char' | 'choice' | 'damage' | 'decoDesc' |
    'del' | 'event' | 'g' | 'gap' | 'geogname' | 'glyph' | 'graphic' | 'handDesc' | 'history' | 'l' | 'lb' | 'lem' | 'lg' | 'msContents' | 'msDesc' | 'msIdentifier' | 'msItem' | 'msItemStruct' | 'msPart' | 'musicNotation' | 'note' | 'objectDesc' | 'orgname' | 'origin' | 'p' | 'persname' | 'physDesc' | 'placename' | 'provenance' | 'ptr' | 'person' |
    'personGrp' | 'place' | 'org' | 'rdg' | 'scriptDesc' | 'sealDesc' | 'sic' | 'summary' | 'surface' | 'supplied' | 'surplus' |
    'typeDesc' | 'w' | 'zone';

export const parseF: { [T in SupportedTagNames]: Parser<XMLElement> } = {
    acquisition: createParser(AcquisitionParser, parse),
    add: createParser(AdditionParser, parse),
    altIdentifier: createParser(AltIdentifierParser, parse),
    app: createParser(AppParser, parse),
    bindingDesc: createParser(BindingDescParser, parse),
    char: createParser(CharParser, parse),
    choice: createParser(ChoiceParser, parse),
    damage: createParser(DamageParser, parse),
    decoDesc: createParser(DecoDescParser, parse),
    del: createParser(DeletionParser, parse),
    event: createParser(NamedEntityRefParser, parse),
    g: createParser(GParser, parse),
    gap: createParser(GapParser, parse),
    geogname: createParser(NamedEntityRefParser, parse),
    glyph: createParser(GlyphParser, parse),
    graphic: createParser(GraphicParser, parse),
    handDesc: createParser(HandDescParser, parse),
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
    musicNotation: createParser(MusicNotationParser, parse),
    note: createParser(NoteParser, parse),
    objectDesc: createParser(ObjectDescParser, parse),
    origin: createParser(OriginParser, parse),
    org: createParser(OrganizationParser, parse),
    orgname: createParser(NamedEntityRefParser, parse),
    p: createParser(ParagraphParser, parse),
    persname: createParser(NamedEntityRefParser, parse),
    physDesc: createParser(PhysDescParser, parse),
    placename: createParser(NamedEntityRefParser, parse),
    provenance: createParser(ProvenanceParser, parse),
    ptr: createParser(PtrParser, parse),
    person: createParser(PersonParser, parse),
    personGrp: createParser(PersonGroupParser, parse),
    place: createParser(PlaceParser, parse),
    rdg: createParser(RdgParser, parse),
    // event: createParser(EventParser), // TODO: check event parser
    scriptDesc: createParser(ScriptDescParser, parse),
    sealDesc: createParser(SealDescParser, parse),
    sic: createParser(SicParser, parse),
    summary: createParser(SummaryParser, parse),
    surface: createParser(SurfaceParser, parse),
    supplied: createParser(SuppliedParser, parse),
    surplus: createParser(SurplusParser, parse),
    typeDesc: createParser(TypeDescParser, parse),
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
