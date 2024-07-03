import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationRef, DoBootstrap, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { GridsterModule } from 'angular-gridster2';
import { DynamicAttributesModule, DynamicModule } from 'ng-dynamic-component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UiComponentsModule } from './ui-components/ui-components.module';

import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppTranslationModule } from './app-translation.module';
import { AppComponent } from './app.component';

import { Ng2HandySyntaxHighlighterModule } from 'ng2-handy-syntax-highlighter';
import { AppConfig } from './app.config';

import { AdditionalComponent } from './components/additional/additional.component';
import { AdditionComponent } from './components/addition/addition.component';
import { AnalogueDetailComponent } from './components/analogues/analogue-detail/analogue-detail.component';
import { AnalogueEntryComponent } from './components/analogues/analogue-entry/analogue-entry.component';
import { AnaloguesComponent } from './components/analogues/analogues.component';
import { AnnotatorDirective } from './directives/annotator.directive';
import { AnnotatorService } from './services/annotator/annotator.service';
import { ApparatusEntryComponent } from './components/apparatus-entry/apparatus-entry.component';
import { ApparatusEntryDetailComponent } from './components/apparatus-entry/apparatus-entry-detail/apparatus-entry-detail.component';
import { ApparatusEntryReadingsComponent } from './components/apparatus-entry/apparatus-entry-readings/apparatus-entry-readings.component';
import { BiblioEntryComponent } from './components/biblio/biblio.component';
import { BibliographyInfoComponent } from './components/bibliography-info/bibliography-info.component';
import { BibliographicStyleSelectorComponent } from './components/bibliography-info/bibliographic-style-selector/bibliographic-style-selector';
import { BiblioListComponent } from './components/biblioList/biblio-list.component';
import { ChangeLayerSelectorComponent } from './components/change-layer-selector/change-layer-selector.component';
import { CharComponent } from './components/char/char.component';
import { ChoiceComponent } from './components/choice/choice.component';
import { CollationComponent } from './view-modes/collation/collation.component';
import { ContentViewerComponent } from './components/content-viewer/content-viewer.component';
import { CriticalApparatusComponent } from './components/critical-apparatus/critical-apparatus.component';
import { DamageComponent } from './components/damage/damage.component';
import { DeletionComponent } from './components/deletion/deletion.component';
import { DocumentalMixedComponent } from './view-modes/documental-mixed/documental-mixed.component';
import { EditionLevelSelectorComponent } from './components/edition-level-selector/edition-level-selector.component';
import { EditionStmtComponent } from './components/edition-stmt/edition-stmt.component';
import { EditorialConventionLayoutDirective } from './directives/editorial-convention-layout.directive';
import { EditorialDeclComponent } from './components/editorial-decl/editorial-decl.component';
import { EncodingDescComponent } from './components/encoding-desc/encoding-desc.component';
import { EntitiesSelectComponent } from './components/entities-select/entities-select.component';
import { EvtInfoComponent } from './evt-info/evt-info.component';
import { ExtentComponent } from './components/extent/extent.component';
import { FileDescComponent } from './components/file-desc/file-desc.component';
import { FilterPipe } from './pipes/filter.pipe';
import { GapComponent } from './components/gap/gap.component';
import { GComponent } from './components/g/g.component';
import { GenericElementComponent } from './components/generic-element/generic-element.component';
import { GenericParserService } from './services/xml-parsers/generic-parser.service';
import { GlobalListsComponent } from './components/global-lists/global-lists.component';
import { HandleImgErrorDirective } from './directives/handle-img-error.directive';
import { HighlightDirective } from './directives/highlight.directive';
import { HistoryComponent } from './components/history/history.component';
import { HtmlAttributesDirective } from './directives/html-attributes.directive';
import { HumanizePipe } from './pipes/humanize.pipe';
import { IdbService } from './services/idb.service';
import { IdentifierComponent } from './components/identifier/identifier.component';
import { ImageImageComponent } from './view-modes/image-image/image-image.component';
import { ImageGrpPanelComponent } from './panels/imagegrp-panel/imagegrp-panel.component';
import { ImageOnlyComponent } from './view-modes/image-only/image-only.component';
import { ImagePanelComponent } from './panels/image-panel/image-panel.component';
import { ImageTextComponent } from './view-modes/image-text/image-text.component';
import { LbComponent } from './components/lb/lb.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ManuscriptThumbnailsViewerComponent } from './components/manuscript-thumbnails-viewer/manuscript-thumbnails-viewer.component';
import { ModComponent } from './components/mod/mod.component';
import { ModDetailComponent } from './components/mod/mod-detail/mod-detail.component';
import { ModGroupComponent } from './components/mod/mod-group/mod-group.component';
import { ModSequenceComponent } from './components/mod/mod-sequence/mod-sequence.component';
import { MsContentsComponent } from './components/ms-contents/ms-contents.component';
import { MsDescComponent } from './components/ms-desc/ms-desc.component';
import { MsDescSectionComponent } from './ui-components/ms-desc-section/ms-desc-section.component';
import { MsDescSelectorComponent } from './components/ms-desc-selector/ms-desc-selector.component';
import { MsFragComponent } from './components/ms-frag/ms-frag.component';
import { MsIdentifierComponent } from './components/ms-identifier/ms-identifier.component';
import { MsItemComponent } from './components/ms-item/ms-item.component';
import { MsPartComponent } from './components/ms-part/ms-part.component';
import { NamedEntitiesListComponent } from './components/named-entities-list/named-entities-list.component';
import { NamedEntityComponent } from './components/named-entity/named-entity.component';
import { NamedEntityDetailComponent } from './components/named-entity/named-entity-detail/named-entity-detail.component';
import { NamedEntityOccurrenceComponent } from './components/named-entity/named-entity-occurrence/named-entity-occurrence.component';
import { NamedEntityRefComponent } from './components/named-entity-ref/named-entity-ref.component';
import { NamedEntityRelationComponent } from './components/named-entity-relation/named-entity-relation.component';
import { NamespaceComponent } from './components/namespace/namespace.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavBarImageComponent } from './nav-bar-image/nav-bar-image.component';
import { NoteComponent } from './components/note/note.component';
import { NotesStmtComponent } from './components/notes-stmt/notes-stmt.component';
import { OriginalEncodingViewerComponent } from './components/original-encoding-viewer/original-encoding-viewer.component';
import { OsdComponent } from './components/osd/osd.component';
import { PageComponent } from './components/page/page.component';
import { PageSelectorComponent } from './components/page-selector/page-selector.component';
import { ParagraphComponent } from './components/paragraph/paragraph.component';
import { PhysDescComponent } from './components/phys-desc/phys-desc.component';
import { PinboardComponent } from './pinboard/pinboard.component';
import { PinboardPanelComponent } from './panels/pinboard-panel/pinboard-panel.component';
import { PinnerComponent } from './pinboard/pinner/pinner.component';
import { ProjectDescComponent } from './components/project-desc/project-desc.component';
import { ProjectInfoComponent } from './components/project-info/project-info.component';
import { PublicationStmtComponent } from './components/publication-stmt/publication-stmt.component';
import { QuoteEntryComponent } from './components/quote-entry/quote-entry.component';
import { ReadingComponent } from './components/reading/reading.component';
import { ReadingTextComponent } from './view-modes/reading-text/reading-text.component';
import { RenditionComponent } from './components/rendition/rendition.component';
import { RespStmtComponent } from './components/resp-stmt/resp-stmt.component';
import { SamplingDeclComponent } from './components/sampling-decl/sampling-decl.component';
import { SeriesStmtComponent } from './components/series-stmt/series-stmt.component';
import { ShortcutsComponent } from './shortcuts/shortcuts.component';
import { SicComponent } from './components/sic/sic.component';
import { SpaceComponent } from './components/space/space.component';
import { SourceDetailComponent } from './components/sources/source-detail/source-detail.component';
import { SourceNoteComponent } from './components/sources/source-note/source-note.component';
import { SourcesComponent } from './components/sources/sources.component';
import { SourcesPanelComponent } from './panels/sources-panel/sources-panel.component';
import { StartsWithPipe } from './pipes/starts-with.pipe';
import { StyledBiblioEntryComponent } from './components/bibliography-info/biblio-styled/biblio-styled.component';
import { SubstitutionComponent } from './components/substitution/substitution.component';
import { SuppliedComponent } from './components/supplied/supplied.component';
import { SurplusComponent } from './components/surplus/surplus.component';
import { TagsDeclComponent } from './components/tags-decl/tags-decl.component';
import { TextComponent } from './components/text/text.component';
import { TextPanelComponent } from './panels/text-panel/text-panel.component';
import { TextSourcesComponent } from './view-modes/text-sources/text-sources.component';
import { TextTextComponent } from './view-modes/text-text/text-text.component';
import { TextVersionsComponent } from './view-modes/text-versions/text-versions.component';
import { ThemesService } from './services/themes.service';
import { TitleStmtComponent } from './components/title-stmt/title-stmt.component';
import { VceditorComponent } from './components/vceditor/vceditor.component';
import { VerseComponent } from './components/verse/verse.component';
import { VersesGroupComponent } from './components/verses-group/verses-group.component';
import { VersionPanelComponent } from './panels/version-panel/version-panel.component';
import { WordComponent } from './components/word/word.component';
import { WitnessPanelComponent } from './panels/witness-panel/witness-panel.component';
import { XmlBeautifyPipe } from './pipes/xml-beautify.pipe';
import { XMLParsers } from './services/xml-parsers/xml-parsers';

const routes: Routes = [
];

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

const DynamicComponents = [
  AdditionalComponent,
  AdditionComponent,
  AnalogueEntryComponent,
  ApparatusEntryComponent,
  ApparatusEntryDetailComponent,
  ApparatusEntryReadingsComponent,
  CharComponent,
  ChoiceComponent,
  DamageComponent,
  DeletionComponent,
  EditionStmtComponent,
  EditorialDeclComponent,
  EncodingDescComponent,
  ExtentComponent,
  FileDescComponent,
  GapComponent,
  GComponent,
  GenericElementComponent,
  HistoryComponent,
  IdentifierComponent,
  LbComponent,
  MsContentsComponent,
  MsDescComponent,
  MsFragComponent,
  MsIdentifierComponent,
  MsItemComponent,
  MsPartComponent,
  NamedEntitiesListComponent,
  NamedEntityComponent,
  NamedEntityDetailComponent,
  NamedEntityRefComponent,
  NamedEntityRelationComponent,
  NamespaceComponent,
  NoteComponent,
  NotesStmtComponent,
  ParagraphComponent,
  PhysDescComponent,
  ProjectDescComponent,
  PublicationStmtComponent,
  QuoteEntryComponent,
  ReadingComponent,
  RenditionComponent,
  RespStmtComponent,
  SamplingDeclComponent,
  SeriesStmtComponent,
  SicComponent,
  SpaceComponent,
  SuppliedComponent,
  SurplusComponent,
  TagsDeclComponent,
  TextComponent,
  TitleStmtComponent,
  VerseComponent,
  VersesGroupComponent,
  WordComponent,
];

@NgModule({
  declarations: [
    AnalogueDetailComponent,
    AnaloguesComponent,
    AnnotatorDirective,
    AppComponent,
    BiblioEntryComponent,
    BibliographyInfoComponent,
    BibliographicStyleSelectorComponent,
    BiblioListComponent,
    ChangeLayerSelectorComponent,
    CollationComponent,
    ContentViewerComponent,
    CriticalApparatusComponent,
    DocumentalMixedComponent,
    EditionLevelSelectorComponent,
    EditorialConventionLayoutDirective,
    EntitiesSelectComponent,
    EvtInfoComponent,
    FilterPipe,
    GlobalListsComponent,
    HandleImgErrorDirective,
    HighlightDirective,
    HtmlAttributesDirective,
    HumanizePipe,
    ImagePanelComponent,
    ImageGrpPanelComponent,
    ImageTextComponent,
    ImageOnlyComponent,
    ImageImageComponent,
    MainHeaderComponent,
    MainMenuComponent,
    ManuscriptThumbnailsViewerComponent,
    ModComponent,
    ModDetailComponent,
    ModGroupComponent,
    ModSequenceComponent,
    MsDescSectionComponent,
    MsDescSelectorComponent,
    NamedEntityOccurrenceComponent,
    NavBarComponent,
    NavBarImageComponent,
    OriginalEncodingViewerComponent,
    OsdComponent,
    PageComponent,
    PageSelectorComponent,
    PinboardComponent,
    PinboardPanelComponent,
    PinnerComponent,
    ProjectInfoComponent,
    ReadingTextComponent,
    ShortcutsComponent,
    SourceDetailComponent,
    SourceNoteComponent,
    SourcesComponent,
    SourcesPanelComponent,
    StartsWithPipe,
    StyledBiblioEntryComponent,
    SubstitutionComponent,
    TextPanelComponent,
    TextSourcesComponent,
    TextTextComponent,
    TextVersionsComponent,
    VersionPanelComponent,
    VceditorComponent,
    WitnessPanelComponent,
    XmlBeautifyPipe,
    ...DynamicComponents,
  ],
  imports: [
    AppRoutingModule,
    AppTranslationModule,
    BrowserModule,
    BrowserAnimationsModule,
    DynamicAttributesModule,
    DynamicModule,
    ExperimentalScrollingModule,
    FormsModule,
    GridsterModule,
    HttpClientModule,
    Ng2HandySyntaxHighlighterModule,
    NgbModule,
    NgbPopoverModule,
    NgxSliderModule,
    NgxSpinnerModule,
    RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' }),
    ScrollingModule,
    UiComponentsModule,
  ],
  providers: [
    AnnotatorService,
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig], multi: true,
    },
    AppConfig,
    GenericParserService,
    IdbService,
    ThemesService,
    XMLParsers,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule implements DoBootstrap {
  constructor(
    library: FaIconLibrary,
  ) {
    library.addIconPacks(fas);

  }

  ngDoBootstrap(appRef: ApplicationRef): void {
    DynamicComponents.forEach((c) => appRef.bootstrap(c));
  }
}
