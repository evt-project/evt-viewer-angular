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
    BindingParser, CollationParser, CollectionParser, ConditionParser, CustEventParser, CustodialHistParser, DecoDescParser, DecoNoteParser,
    DepthParser, DimensionsParser, DimParser, ExplicitParser, FiliationParser, FinalRubricParser, FoliationParser,
    HandDescParser, HeadParser, HeightParser, HistoryParser, IncipitParser, InstitutionParser, LayoutDescParser, LayoutParser,
    LocusGrpParser, LocusParser, MsContentsParser, MsDescParser, MsFragParser, MsIdentifierParser, MsItemParser,
    MsItemStructParser, MsNameParser, MsPartParser, MusicNotationParser, ObjectDescParser, OrigDateParser, OriginParser,
    OrigPlaceParser, PhysDescParser, ProvenanceParser, RecordHistParser, RepositoryParser, RubricParser, ScriptDescParser,
    SealDescParser, SealParser, SourceParser, SummaryParser, SupportDescParser, SupportParser, SurrogatesParser, TypeDescParser,
    TypeNoteParser, WidthParser,
} from './msdesc-parser';
import {
    NamedEntityRefParser, OrganizationParser,
    PersonGroupParser, PersonParser, PlaceParser,
} from './named-entity-parsers';
import { createParser, Parser, ParseResult } from './parser-models';

type AnalysisTags = 'w';
type CoreTags = 'add' | 'choice' | 'del' | 'gap' | 'graphic' | 'head' | 'l' | 'lb' | 'lg' | 'note' | 'p' | 'ptr' | 'sic';
type GaijiTags = 'char' | 'g' | 'glyph';
type MsDescriptionTags = 'accMat' | 'acquisition' | 'additional' | 'additions' | 'adminInfo' | 'altIdentifier' |
    'binding' | 'bindingDesc' | 'collation' | 'collection' | 'condition' | 'custEvent' | 'custodialHist' |
    'decoDesc' | 'decoNote' | 'depth' | 'dim' | 'dimensions' | 'explicit' | 'filiation' | 'finalRubric' | 'foliation' |
    'handDesc' | 'height' | 'history' | 'incipit' | 'institution' | 'layout' | 'layoutDesc' | 'locus' | 'locusGrp' |
    'msContents' | 'msDesc' | 'msFrag' | 'msIdentifier' | 'msItem' | 'msItemStruct' | 'msName' | 'msPart' | 'musicNotation' |
    'objectDesc' | 'origDate' | 'origin' | 'origPlace' | 'physDesc' | 'provenance' | 'recordHist' | 'repository' | 'rubric' |
    'scriptDesc' | 'seal' | 'sealDesc' | 'source' | 'summary' | 'support' | 'supportDesc' | 'surrogates' |
    'typeDesc' | 'typeNote' | 'width';
type NamesDatesTags = 'event' | 'geogname' | 'org' | 'orgname' | 'persname' | 'person' | 'personGrp' | 'place' | 'placename';
type TextCritTags = 'app' | 'lem' | 'rdg';
type TranscrTags = 'damage' | 'supplied' | 'surface' | 'surplus' | 'zone';

type SupportedTagNames = AnalysisTags | CoreTags | GaijiTags | MsDescriptionTags | TextCritTags | TranscrTags | NamesDatesTags;

const analysisParseF: { [T in AnalysisTags]: Parser<XMLElement> } = {
    w: createParser(WordParser, parse),
};

const coreParseF: { [T in CoreTags]: Parser<XMLElement> } = {
    add: createParser(AdditionParser, parse),
    choice: createParser(ChoiceParser, parse),
    del: createParser(DeletionParser, parse),
    gap: createParser(GapParser, parse),
    graphic: createParser(GraphicParser, parse),
    head: createParser(HeadParser, parse),
    l: createParser(VerseParser, parse),
    lb: createParser(LBParser, parse),
    lg: createParser(VersesGroupParser, parse),
    note: createParser(NoteParser, parse),
    p: createParser(ParagraphParser, parse),
    ptr: createParser(PtrParser, parse),
    sic: createParser(SicParser, parse),
};

const gaijiParseF: { [T in GaijiTags]: Parser<XMLElement> } = {
    char: createParser(CharParser, parse),
    g: createParser(GParser, parse),
    glyph: createParser(GlyphParser, parse),
};

const msDescriptionParseF: { [T in MsDescriptionTags]: Parser<XMLElement> } = {
    accMat: createParser(AccMatParser, parse),
    acquisition: createParser(AcquisitionParser, parse),
    additional: createParser(AdditionalParser, parse),
    additions: createParser(AdditionsParser, parse),
    adminInfo: createParser(AdminInfoParser, parse),
    altIdentifier: createParser(AltIdentifierParser, parse),
    binding: createParser(BindingParser, parse),
    bindingDesc: createParser(BindingDescParser, parse),
    collation: createParser(CollationParser, parse),
    collection: createParser(CollectionParser, parse),
    condition: createParser(ConditionParser, parse),
    custEvent: createParser(CustEventParser, parse),
    custodialHist: createParser(CustodialHistParser, parse),
    decoDesc: createParser(DecoDescParser, parse),
    decoNote: createParser(DecoNoteParser, parse),
    depth: createParser(DepthParser, parse),
    dim: createParser(DimParser, parse),
    dimensions: createParser(DimensionsParser, parse),
    explicit: createParser(ExplicitParser, parse),
    filiation: createParser(FiliationParser, parse),
    finalRubric: createParser(FinalRubricParser, parse),
    foliation: createParser(FoliationParser, parse),
    handDesc: createParser(HandDescParser, parse),
    height: createParser(HeightParser, parse),
    history: createParser(HistoryParser, parse),
    incipit: createParser(IncipitParser, parse),
    institution: createParser(InstitutionParser, parse),
    layout: createParser(LayoutParser, parse),
    layoutDesc: createParser(LayoutDescParser, parse),
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
    objectDesc: createParser(ObjectDescParser, parse),
    origDate: createParser(OrigDateParser, parse),
    origin: createParser(OriginParser, parse),
    origPlace: createParser(OrigPlaceParser, parse),
    physDesc: createParser(PhysDescParser, parse),
    provenance: createParser(ProvenanceParser, parse),
    recordHist: createParser(RecordHistParser, parse),
    repository: createParser(RepositoryParser, parse),
    rubric: createParser(RubricParser, parse),
    scriptDesc: createParser(ScriptDescParser, parse),
    seal: createParser(SealParser, parse),
    sealDesc: createParser(SealDescParser, parse),
    source: createParser(SourceParser, parse),
    summary: createParser(SummaryParser, parse),
    support: createParser(SupportParser, parse),
    supportDesc: createParser(SupportDescParser, parse),
    surrogates: createParser(SurrogatesParser, parse),
    typeDesc: createParser(TypeDescParser, parse),
    typeNote: createParser(TypeNoteParser, parse),
    width: createParser(WidthParser, parse),
};

const namesDatesParseF: { [T in NamesDatesTags]: Parser<XMLElement> } = {
    event: createParser(NamedEntityRefParser, parse),
    // event: createParser(EventParser), // TODO: check event parser
    geogname: createParser(NamedEntityRefParser, parse),
    org: createParser(OrganizationParser, parse),
    orgname: createParser(NamedEntityRefParser, parse),
    persname: createParser(NamedEntityRefParser, parse),
    person: createParser(PersonParser, parse),
    personGrp: createParser(PersonGroupParser, parse),
    place: createParser(PlaceParser, parse),
    placename: createParser(NamedEntityRefParser, parse),
};

const textCritParseF: { [T in TextCritTags]: Parser<XMLElement> } = {
    app: createParser(AppParser, parse),
    lem: createParser(RdgParser, parse),
    rdg: createParser(RdgParser, parse),
};

const transcrParseF: { [T in TranscrTags]: Parser<XMLElement> } = {
    damage: createParser(DamageParser, parse),
    supplied: createParser(SuppliedParser, parse),
    surface: createParser(SurfaceParser, parse),
    surplus: createParser(SurplusParser, parse),
    zone: createParser(ZoneParser, parse),
};

export const parseF: { [T in SupportedTagNames]: Parser<XMLElement> } = {
    ...analysisParseF,
    ...coreParseF,
    ...gaijiParseF,
    ...namesDatesParseF,
    ...textCritParseF,
    ...transcrParseF,
    ...msDescriptionParseF,
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
