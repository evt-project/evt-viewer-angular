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
    AccMatParser, AcquisitionParser, AdditionalParser, AdditionsParser, AltIdentifierParser, BindingDescParser, CollectionParser,
    DecoDescParser, HandDescParser, HeadParser, HistoryParser, InstitutionParser, MsContentsParser, MsDescParser, MsFragParser,
    MsIdentifierParser, MsItemParser, MsItemStructParser, MsNameParser, MsPartParser, MusicNotationParser, ObjectDescParser, OriginParser,
    PhysDescParser, ProvenanceParser, RepositoryParser, RubricParser, ScriptDescParser, SealDescParser, SummaryParser, TypeDescParser,
} from './msdesc-parser';
import {
    NamedEntityRefParser, OrganizationParser,
    PersonGroupParser, PersonParser, PlaceParser,
} from './named-entity-parsers';
import { createParser, Parser, ParseResult } from './parser-models';

type SupportedTagNames = 'accMat' | 'add' | 'additional' | 'additions' | 'altIdentifier' | 'app' | 'acquisition' | 'bindingDesc' | 'char' | 'choice' | 'collection' | 'damage' | 'decoDesc' |
    'del' | 'event' | 'g' | 'gap' | 'geogname' | 'glyph' | 'graphic' | 'handDesc' | 'head' | 'history' | 'institution' | 'l' |
    'lb' | 'lem' | 'lg' | 'msContents' | 'msDesc' | 'msFrag' | 'msIdentifier' | 'msItem' | 'msItemStruct' | 'msName' |'msPart' | 'musicNotation' | 'note' | 'objectDesc' |
    'orgname' | 'origin' | 'p' | 'persname' | 'physDesc' | 'placename' | 'provenance' | 'ptr' | 'person' | 'personGrp' | 'place' | 'org' | 'rdg' | 'repository' | 'rubric' |
    'scriptDesc' | 'sealDesc' | 'sic' | 'summary' | 'surface' | 'supplied' | 'surplus' | 'typeDesc' | 'w' | 'zone';

export const parseF: { [T in SupportedTagNames]: Parser<XMLElement> } = {
    accMat: createParser(AccMatParser, parse),
    acquisition: createParser(AcquisitionParser, parse),
    add: createParser(AdditionParser, parse),
    additional: createParser(AdditionalParser, parse),
    additions: createParser(AdditionsParser, parse),
    altIdentifier: createParser(AltIdentifierParser, parse),
    app: createParser(AppParser, parse),
    bindingDesc: createParser(BindingDescParser, parse),
    char: createParser(CharParser, parse),
    choice: createParser(ChoiceParser, parse),
    collection: createParser(CollectionParser, parse),
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
    head: createParser(HeadParser, parse),
    history: createParser(HistoryParser, parse),
    institution: createParser(InstitutionParser, parse),
    l: createParser(VerseParser, parse),
    lb: createParser(LBParser, parse),
    lg: createParser(VersesGroupParser, parse),
    lem: createParser(RdgParser, parse),
    msContents: createParser(MsContentsParser, parse),
    msDesc: createParser(MsDescParser, parse),
    msFrag: createParser(MsFragParser, parse),
    msIdentifier: createParser(MsIdentifierParser, parse),
    msItem: createParser(MsItemParser, parse),
    msItemStruct: createParser(MsItemStructParser, parse),
    msName: createParser(MsNameParser, parse),
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
    repository: createParser(RepositoryParser, parse),
    rubric: createParser(RubricParser, parse),
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
