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
    AccMatParser, AcquisitionParser, AdditionalParser, AdditionsParser, AdminInfoParser, AltIdentifierParser, BindingDescParser,
    BindingParser, CollectionParser, CustEventParser, CustodialHistParser, DecoDescParser, DecoNoteParser, DimensionsParser,
    ExplicitParser, FiliationParser, FinalRubricParser, FoliationParser, HandDescParser, HeadParser, HistoryParser, IncipitParser,
    InstitutionParser, LayoutDescParser, LocusGrpParser, LocusParser, MsContentsParser, MsDescParser, MsFragParser, MsIdentifierParser,
    MsItemParser, MsItemStructParser, MsNameParser, MsPartParser, MusicNotationParser, ObjectDescParser, OrigDateParser, OriginParser,
    OrigPlaceParser, PhysDescParser, ProvenanceParser, RecordHistParser, RepositoryParser, RubricParser, ScriptDescParser,
    SealDescParser, SealParser, SummaryParser, SupportDescParser, SupportParser, SurrogatesParser, TypeDescParser, TypeNoteParser,
} from './msdesc-parser';
import {
    NamedEntityRefParser, OrganizationParser,
    PersonGroupParser, PersonParser, PlaceParser,
} from './named-entity-parsers';
import { createParser, Parser, ParseResult } from './parser-models';

type SupportedTagNames = 'accMat' | 'add' | 'additional' | 'additions' | 'adminInfo' | 'altIdentifier' | 'app' | 'acquisition' | 'binding' | 'bindingDesc' | 'char' | 'choice' | 'collection' | 'custEvent' |
    'custodialHist' | 'damage' | 'decoDesc' | 'decoNote' | 'del' | 'dimensions' | 'event' | 'explicit' | 'filiation' | 'finalRubric' | 'foliation' | 'g' | 'gap' | 'geogname' | 'glyph' | 'graphic' | 'handDesc' |
    'head' | 'history' | 'incipit' | 'institution' | 'l' | 'layoutDesc' | 'lb' | 'lem' | 'lg' | 'locus' | 'locusGrp' | 'msContents' | 'msDesc' | 'msFrag' | 'msIdentifier' | 'msItem' |
    'msItemStruct' | 'msName' | 'msPart' | 'musicNotation' | 'note' | 'objectDesc' | 'orgname' | 'origDate' | 'origin' | 'origPlace' | 'p' | 'persname' | 'physDesc' | 'placename' | 'provenance' |
    'ptr' | 'person' | 'personGrp' | 'place' | 'org' | 'rdg' | 'recordHist' | 'repository' | 'rubric' | 'scriptDesc' | 'seal' | 'sealDesc' | 'sic' | 'summary' | 'supportDesc' |
    'supplied' | 'support' | 'surface' | 'surrogates' | 'surplus' | 'typeDesc' | 'typeNote' | 'w' | 'zone';

export const parseF: { [T in SupportedTagNames]: Parser<XMLElement> } = {
    accMat: createParser(AccMatParser, parse),
    acquisition: createParser(AcquisitionParser, parse),
    add: createParser(AdditionParser, parse),
    additional: createParser(AdditionalParser, parse),
    additions: createParser(AdditionsParser, parse),
    adminInfo: createParser(AdminInfoParser, parse),
    altIdentifier: createParser(AltIdentifierParser, parse),
    app: createParser(AppParser, parse),
    binding: createParser(BindingParser, parse),
    bindingDesc: createParser(BindingDescParser, parse),
    char: createParser(CharParser, parse),
    choice: createParser(ChoiceParser, parse),
    collection: createParser(CollectionParser, parse),
    custEvent: createParser(CustEventParser, parse),
    custodialHist: createParser(CustodialHistParser, parse),
    damage: createParser(DamageParser, parse),
    decoDesc: createParser(DecoDescParser, parse),
    decoNote: createParser(DecoNoteParser, parse),
    del: createParser(DeletionParser, parse),
    dimensions: createParser(DimensionsParser, parse),
    event: createParser(NamedEntityRefParser, parse),
    explicit: createParser(ExplicitParser, parse),
    filiation: createParser(FiliationParser, parse),
    finalRubric: createParser(FinalRubricParser, parse),
    foliation: createParser(FoliationParser, parse),
    g: createParser(GParser, parse),
    gap: createParser(GapParser, parse),
    geogname: createParser(NamedEntityRefParser, parse),
    glyph: createParser(GlyphParser, parse),
    graphic: createParser(GraphicParser, parse),
    handDesc: createParser(HandDescParser, parse),
    head: createParser(HeadParser, parse),
    history: createParser(HistoryParser, parse),
    incipit: createParser(IncipitParser, parse),
    institution: createParser(InstitutionParser, parse),
    l: createParser(VerseParser, parse),
    layoutDesc: createParser(LayoutDescParser, parse),
    lb: createParser(LBParser, parse),
    lg: createParser(VersesGroupParser, parse),
    lem: createParser(RdgParser, parse),
    locus: createParser(LocusParser, parse),
    locusGrp: createParser(LocusGrpParser, parse),
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
    origDate: createParser(OrigDateParser, parse),
    origin: createParser(OriginParser, parse),
    origPlace: createParser(OrigPlaceParser, parse),
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
    recordHist: createParser(RecordHistParser, parse),
    repository: createParser(RepositoryParser, parse),
    rubric: createParser(RubricParser, parse),
    scriptDesc: createParser(ScriptDescParser, parse),
    seal: createParser(SealParser, parse),
    sealDesc: createParser(SealDescParser, parse),
    sic: createParser(SicParser, parse),
    summary: createParser(SummaryParser, parse),
    surface: createParser(SurfaceParser, parse),
    surrogates: createParser(SurrogatesParser, parse),
    supplied: createParser(SuppliedParser, parse),
    support: createParser(SupportParser, parse),
    supportDesc: createParser(SupportDescParser, parse),
    surplus: createParser(SurplusParser, parse),
    typeDesc: createParser(TypeDescParser, parse),
    typeNote: createParser(TypeNoteParser, parse),
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
