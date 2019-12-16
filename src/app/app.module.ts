import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { GridsterModule } from 'angular-gridster2';
import { DynamicModule } from 'ng-dynamic-component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UiComponentsModule } from './ui-components/ui-components.module';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppTranslationModule } from './app-translation.module';
import { AppComponent } from './app.component';

import { AppConfig } from './app.config';

import { ContentViewerComponent } from './components/content-viewer/content-viewer.component';
import { GenericElementComponent } from './components/generic-element/generic-element.component';
import { NoteComponent } from './components/note/note.component';
import { OsdComponent } from './components/osd/osd.component';
import { PageComponent } from './components/page/page.component';
import { TextComponent } from './components/text/text.component';
import { EvtInfoComponent } from './evt-info/evt-info.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ImagePanelComponent } from './panels/image-panel/image-panel.component';
import { PinboardPanelComponent } from './panels/pinboard-panel/pinboard-panel.component';
import { SourcesPanelComponent } from './panels/sources-panel/sources-panel.component';
import { TextPanelComponent } from './panels/text-panel/text-panel.component';
import { VersionPanelComponent } from './panels/version-panel/version-panel.component';
import { WitnessPanelComponent } from './panels/witness-panel/witness-panel.component';
import { PinboardComponent } from './pinboard/pinboard.component';
import { PinnerComponent } from './pinboard/pinner/pinner.component';
import { ThemesService } from './services/themes.service';
import { GenericParserService } from './services/xml-parsers/generic-parser.service';
import { ShortcutsComponent } from './shortcuts/shortcuts.component';
import { CollationComponent } from './view-modes/collation/collation.component';
import { ImageTextComponent } from './view-modes/image-text/image-text.component';
import { ReadingTextComponent } from './view-modes/reading-text/reading-text.component';
import { TextSourcesComponent } from './view-modes/text-sources/text-sources.component';
import { TextTextComponent } from './view-modes/text-text/text-text.component';
import { TextVersionsComponent } from './view-modes/text-versions/text-versions.component';

const routes: Routes = [
];

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

@NgModule({
  declarations: [
    AppComponent,
    CollationComponent,
    ContentViewerComponent,
    EvtInfoComponent,
    GenericElementComponent,
    ImagePanelComponent,
    ImageTextComponent,
    MainHeaderComponent,
    MainMenuComponent,
    NoteComponent,
    OsdComponent,
    PageComponent,
    PinboardComponent,
    PinboardPanelComponent,
    PinnerComponent,
    ReadingTextComponent,
    ShortcutsComponent,
    SourcesPanelComponent,
    TextComponent,
    TextPanelComponent,
    TextSourcesComponent,
    TextTextComponent,
    TextVersionsComponent,
    VersionPanelComponent,
    WitnessPanelComponent,
  ],
  imports: [
    AppRoutingModule,
    AppTranslationModule,
    BrowserModule,
    DynamicModule.withComponents([
      TextComponent,
      GenericElementComponent,
      NoteComponent,
    ]),
    FormsModule,
    GridsterModule,
    HttpClientModule,
    NgbModule,
    NgbPopoverModule,
    NgxSpinnerModule,
    RouterModule.forRoot(routes, { useHash: true }),
    UiComponentsModule,
  ],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig], multi: true,
    },
    GenericParserService,
    ThemesService,
  ],
  bootstrap: [
    AppComponent,
  ],
  entryComponents: [
    ShortcutsComponent,
    EvtInfoComponent,
  ],
})
export class AppModule {
  constructor(
    library: FaIconLibrary,
  ) {
    library.addIconPacks(fas);
  }
}
