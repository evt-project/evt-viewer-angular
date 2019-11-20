import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { UiComponentsModule } from './ui-components/ui-components.module';
import { FormsModule } from '@angular/forms';
import { GridsterModule } from 'angular-gridster2';
import { DynamicModule } from 'ng-dynamic-component';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { AppTranslationModule } from './app-translation.module';

import { AppConfig } from './app.config';

import { ThemesService } from './services/themes.service';
import { TextPanelComponent } from './panels/text-panel/text-panel.component';
import { ImagePanelComponent } from './panels/image-panel/image-panel.component';
import { ImageTextComponent } from './view-modes/image-text/image-text.component';
import { ReadingTextComponent } from './view-modes/reading-text/reading-text.component';
import { SourcesPanelComponent } from './panels/sources-panel/sources-panel.component';
import { VersionPanelComponent } from './panels/version-panel/version-panel.component';
import { WitnessPanelComponent } from './panels/witness-panel/witness-panel.component';
import { CollationComponent } from './view-modes/collation/collation.component';
import { TextTextComponent } from './view-modes/text-text/text-text.component';
import { TextSourcesComponent } from './view-modes/text-sources/text-sources.component';
import { TextVersionsComponent } from './view-modes/text-versions/text-versions.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ShortcutsComponent } from './shortcuts/shortcuts.component';
import { EvtInfoComponent } from './evt-info/evt-info.component';
import { GenericElementComponent } from './components/generic-element/generic-element.component';
import { ContentViewerComponent } from './components/content-viewer/content-viewer.component';
import { TextComponent } from './components/text/text.component';
import { GenericParserService } from './services/xml-parsers/generic-parser.service';
import { NoteComponent } from './components/note/note.component';
import { PageComponent } from './components/page/page.component';

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
    PageComponent,
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
    RouterModule.forRoot(routes, { useHash: true }),
    UiComponentsModule,
  ],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig], multi: true
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
