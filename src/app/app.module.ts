import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { UiComponentsModule } from './ui-components/ui-components.module';

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
    ImagePanelComponent,
    ImageTextComponent,
    ReadingTextComponent,
    TextPanelComponent,
  ],
  imports: [
    AppRoutingModule,
    AppTranslationModule,
    BrowserModule,
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
