import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { UiComponentsModule } from './ui-components/ui-components.module';
import { GridsterModule } from 'angular-gridster2';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { AppTranslationModule } from './app-translation.module';

import { ThemesService } from './services/themes.service';

import { L10nConfig, L10nLoader, TranslationModule, StorageStrategy, ProviderType, LogLevel } from 'angular-l10n';

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

const routes: Routes = [
];
const l10nConfig: L10nConfig = {
  logger: {
    level: LogLevel.Warn
  },
  locale: {
    languages: [
      { code: 'en', dir: 'ltr' },
      { code: 'it', dir: 'ltr' },
    ],
    language: 'en',
    storage: StorageStrategy.Cookie
  },
  translation: {
    providers: [
      { type: ProviderType.Static, prefix: './assets/l10n/locale-' },
    ],
    caching: true,
    composedKeySeparator: '.',
    missingValue: 'No key'
  }
};

@NgModule({
  declarations: [
    AppComponent,
    CollationComponent,
    ImagePanelComponent,
    ImageTextComponent,
    MainHeaderComponent,
    MainMenuComponent,
    ReadingTextComponent,
    SourcesPanelComponent,
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
    GridsterModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { useHash: true }),
    TranslationModule.forRoot(l10nConfig),
    UiComponentsModule,
  ],
  providers: [
    ThemesService,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
  constructor(
    public l10nLoader: L10nLoader,
    library: FaIconLibrary,
  ) {
    this.l10nLoader.load();
    library.addIconPacks(fas);
  }
}
