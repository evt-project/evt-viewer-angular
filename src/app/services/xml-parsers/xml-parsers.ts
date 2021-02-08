import { Injectable, Type } from '@angular/core';
import { AppParser, RdgParser } from './app-parser';
import {
    AdditionParser, DamageParser, DeletionParser, GapParser, LBParser, NoteParser, ParagraphParser, PtrParser, SuppliedParser,
    VerseParser, VersesGroupParser, WordParser,
} from './basic-parsers';
import { CharParser, GlyphParser, GParser } from './character-declarations-parser';
import { ChoiceParser } from './choice-parser';
import { SicParser, SurplusParser } from './editorial-parsers';
import { GraphicParser, SurfaceParser, ZoneParser } from './facsimile-parser';
import { CorrectionParser, EditorialDeclParser, EncodingDescParser, ProjectDescParser, SamplingDeclParser } from './header-parser';
import {
    AccMatParser, AcquisitionParser, AdditionalParser, AdditionsParser, AdminInfoParser,
    AltIdentifierParser, BindingDescParser, BindingParser, CollationParser, CollectionParser, ConditionParser,
    CustEventParser, CustodialHistParser, DecoDescParser, DecoNoteParser, DepthParser, DimensionsParser,
    DimParser, ExplicitParser, FiliationParser, FinalRubricParser, FoliationParser, HandDescParser,
    HeadParser, HeightParser, HistoryParser, IncipitParser, InstitutionParser, LayoutDescParser, LayoutParser,
    LocusGrpParser, LocusParser, MsContentsParser, MsDescParser, MsFragParser, MsIdentifierParser, MsItemParser,
    MsItemStructParser, MsNameParser, MsPartParser, MusicNotationParser, ObjectDescParser, OrigDateParser, OriginParser,
    OrigPlaceParser, PhysDescParser, ProvenanceParser, RecordHistParser, RepositoryParser, RubricParser, ScriptDescParser,
    SealDescParser, SealParser, SourceParser, SummaryParser, SupportDescParser, SupportParser, SurrogatesParser,
    TypeDescParser, TypeNoteParser, WidthParser,
} from './msdesc-parser';
import { NamedEntityRefParser, OrganizationParser, PersonGroupParser, PersonParser, PlaceParser } from './named-entity-parsers';

// tslint:disable-next-line: no-any
export function ParsersDecl(declarations: Array<Type<any>>) {
    // tslint:disable-next-line: no-any
    return (_: any) => {
        return class extends _ {
            declarations = declarations;
        };
    };
}

@Injectable({
    providedIn: 'root',
})
@ParsersDecl([
    AccMatParser,
    AcquisitionParser,
    AdditionalParser,
    AdditionParser,
    AdditionsParser,
    AdminInfoParser,
    AltIdentifierParser,
    AppParser,
    BindingDescParser,
    BindingParser,
    CharParser,
    ChoiceParser,
    CollationParser,
    CollectionParser,
    ConditionParser,
    CorrectionParser,
    CustEventParser,
    CustodialHistParser,
    DamageParser,
    DecoDescParser,
    DecoNoteParser,
    DeletionParser,
    DepthParser,
    DimensionsParser,
    DimParser,
    EditorialDeclParser,
    EncodingDescParser,
    ExplicitParser,
    FiliationParser,
    FinalRubricParser,
    FoliationParser,
    GapParser,
    GlyphParser,
    GParser,
    GraphicParser,
    HandDescParser,
    HeadParser,
    HeightParser,
    HistoryParser,
    IncipitParser,
    InstitutionParser,
    LayoutDescParser,
    LayoutParser,
    LBParser,
    LocusGrpParser,
    LocusParser,
    MsContentsParser,
    MsDescParser,
    MsFragParser,
    MsIdentifierParser,
    MsItemParser,
    MsItemStructParser,
    MsNameParser,
    MsPartParser,
    MusicNotationParser,
    NamedEntityRefParser,
    NoteParser,
    ObjectDescParser,
    OrganizationParser,
    OrigDateParser,
    OriginParser,
    OrigPlaceParser,
    ParagraphParser,
    PersonGroupParser,
    PersonParser,
    PhysDescParser,
    PlaceParser,
    ProjectDescParser,
    ProvenanceParser,
    PtrParser,
    RdgParser,
    RecordHistParser,
    RepositoryParser,
    RubricParser,
    SamplingDeclParser,
    ScriptDescParser,
    SealDescParser,
    SealParser,
    SicParser,
    SourceParser,
    SummaryParser,
    SuppliedParser,
    SupportDescParser,
    SupportParser,
    SurfaceParser,
    SurplusParser,
    SurrogatesParser,
    TypeDescParser,
    TypeNoteParser,
    VerseParser,
    VersesGroupParser,
    WidthParser,
    WordParser,
    ZoneParser,
])
export class XMLParsers {
}
