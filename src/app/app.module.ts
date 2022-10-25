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

import { AdditionComponent } from './components/addition/addition.component';
import { AdditionalComponent } from './components/additional/additional.component';
import { ApparatusEntryDetailComponent } from './components/apparatus-entry/apparatus-entry-detail/apparatus-entry-detail.component';
import { ApparatusEntryReadingsComponent } from './components/apparatus-entry/apparatus-entry-readings/apparatus-entry-readings.component';
import { ApparatusEntryComponent } from './components/apparatus-entry/apparatus-entry.component';
import { CharComponent } from './components/char/char.component';
import { ChoiceComponent } from './components/choice/choice.component';
import { ContentViewerComponent } from './components/content-viewer/content-viewer.component';
import { DamageComponent } from './components/damage/damage.component';
import { DeletionComponent } from './components/deletion/deletion.component';
import { EditionLevelSelectorComponent } from './components/edition-level-selector/edition-level-selector.component';
import { EditionStmtComponent } from './components/edition-stmt/edition-stmt.component';
import { EditorialDeclComponent } from './components/editorial-decl/editorial-decl.component';
import { EncodingDescComponent } from './components/encoding-desc/encoding-desc.component';
import { EntitiesSelectComponent } from './components/entities-select/entities-select.component';
import { ExtentComponent } from './components/extent/extent.component';
import { FileDescComponent } from './components/file-desc/file-desc.component';
import { GComponent } from './components/g/g.component';
import { GapComponent } from './components/gap/gap.component';
import { GenericElementComponent } from './components/generic-element/generic-element.component';
import { GlobalListsComponent } from './components/global-lists/global-lists.component';
import { HistoryComponent } from './components/history/history.component';
import { IdentifierComponent } from './components/identifier/identifier.component';
import { LbComponent } from './components/lb/lb.component';
import { ManuscriptThumbnailsViewerComponent } from './components/manuscript-thumbnails-viewer/manuscript-thumbnails-viewer.component';
import { MsContentsComponent } from './components/ms-contents/ms-contents.component';
import { MsDescSelectorComponent } from './components/ms-desc-selector/ms-desc-selector.component';
import { MsDescComponent } from './components/ms-desc/ms-desc.component';
import { MsFragComponent } from './components/ms-frag/ms-frag.component';
import { MsIdentifierComponent } from './components/ms-identifier/ms-identifier.component';
import { MsItemComponent } from './components/ms-item/ms-item.component';
import { MsPartComponent } from './components/ms-part/ms-part.component';
import { NamedEntitiesListComponent } from './components/named-entities-list/named-entities-list.component';
import { NamedEntityRefComponent } from './components/named-entity-ref/named-entity-ref.component';
import { NamedEntityRelationComponent } from './components/named-entity-relation/named-entity-relation.component';
import { NamedEntityDetailComponent } from './components/named-entity/named-entity-detail/named-entity-detail.component';
import { NamedEntityOccurrenceComponent } from './components/named-entity/named-entity-occurrence/named-entity-occurrence.component';
import { NamedEntityComponent } from './components/named-entity/named-entity.component';
import { NamespaceComponent } from './components/namespace/namespace.component';
import { NoteComponent } from './components/note/note.component';
import { NotesStmtComponent } from './components/notes-stmt/notes-stmt.component';
import { OriginalEncodingViewerComponent } from './components/original-encoding-viewer/original-encoding-viewer.component';
import { OsdComponent } from './components/osd/osd.component';
import { PageSelectorComponent } from './components/page-selector/page-selector.component';
import { PageComponent } from './components/page/page.component';
import { ParagraphComponent } from './components/paragraph/paragraph.component';
import { PhysDescComponent } from './components/phys-desc/phys-desc.component';
import { ProjectDescComponent } from './components/project-desc/project-desc.component';
import { ProjectInfoComponent } from './components/project-info/project-info.component';
import { PublicationStmtComponent } from './components/publication-stmt/publication-stmt.component';
import { ReadingComponent } from './components/reading/reading.component';
import { RenditionComponent } from './components/rendition/rendition.component';
import { RespStmtComponent } from './components/resp-stmt/resp-stmt.component';
import { SamplingDeclComponent } from './components/sampling-decl/sampling-decl.component';
import { SeriesStmtComponent } from './components/series-stmt/series-stmt.component';
import { SicComponent } from './components/sic/sic.component';
import { SuppliedComponent } from './components/supplied/supplied.component';
import { SurplusComponent } from './components/surplus/surplus.component';
import { TagsDeclComponent } from './components/tags-decl/tags-decl.component';
import { TextComponent } from './components/text/text.component';
import { TitleStmtComponent } from './components/title-stmt/title-stmt.component';
import { VerseComponent } from './components/verse/verse.component';
import { VersesGroupComponent } from './components/verses-group/verses-group.component';
import { WordComponent } from './components/word/word.component';
import { AnnotatorDirective } from './directives/annotator.directive';
import { EditorialConventionLayoutDirective } from './directives/editorial-convention-layout.directive';
import { HighlightDirective } from './directives/highlight.directive';
import { HtmlAttributesDirective } from './directives/html-attributes.directive';
import { EvtInfoComponent } from './evt-info/evt-info.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ImagePanelComponent } from './panels/image-panel/image-panel.component';
import { PinboardPanelComponent } from './panels/pinboard-panel/pinboard-panel.component';
import { SourcesPanelComponent } from './panels/sources-panel/sources-panel.component';
import { TextPanelComponent } from './panels/text-panel/text-panel.component';
import { VersionPanelComponent } from './panels/version-panel/version-panel.component';
import { WitnessPanelComponent } from './panels/witness-panel/witness-panel.component';
import { PinboardComponent } from './pinboard/pinboard.component';
import { PinnerComponent } from './pinboard/pinner/pinner.component';
import { FilterPipe } from './pipes/filter.pipe';
import { HumanizePipe } from './pipes/humanize.pipe';
import { StartsWithPipe } from './pipes/starts-with.pipe';
import { XmlBeautifyPipe } from './pipes/xml-beautify.pipe';
import { AnnotatorService } from './services/annotator/annotator.service';
import { IdbService } from './services/idb.service';
import { ThemesService } from './services/themes.service';
import { GenericParserService } from './services/xml-parsers/generic-parser.service';
import { XMLParsers } from './services/xml-parsers/xml-parsers';
import { ShortcutsComponent } from './shortcuts/shortcuts.component';
import { MsDescSectionComponent } from './ui-components/ms-desc-section/ms-desc-section.component';
import { CollationComponent } from './view-modes/collation/collation.component';
import { ImageTextComponent } from './view-modes/image-text/image-text.component';
import { ReadingTextComponent } from './view-modes/reading-text/reading-text.component';
import { TextSourcesComponent } from './view-modes/text-sources/text-sources.component';
import { TextTextComponent } from './view-modes/text-text/text-text.component';
import { TextVersionsComponent } from './view-modes/text-versions/text-versions.component';
import { HandleImgErrorDirective } from './directives/handle-img-error.directive';

const routes: Routes = [
];

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

const DynamicComponents = [
  AdditionalComponent,
  AdditionComponent,
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
  ReadingComponent,
  RenditionComponent,
  RespStmtComponent,
  SamplingDeclComponent,
  SeriesStmtComponent,
  SicComponent,
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
    AnnotatorDirective,
    AppComponent,
    CollationComponent,
    ContentViewerComponent,
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
    ImageTextComponent,
    MainHeaderComponent,
    MainMenuComponent,
    ManuscriptThumbnailsViewerComponent,
    MsDescSectionComponent,
    MsDescSelectorComponent,
    NamedEntityOccurrenceComponent,
    NavBarComponent,
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
    SourcesPanelComponent,
    StartsWithPipe,
    TextPanelComponent,
    TextSourcesComponent,
    TextTextComponent,
    TextVersionsComponent,
    VersionPanelComponent,
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
