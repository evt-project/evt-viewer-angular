import { NgModule } from '@angular/core';
import { L10nConfig, L10nLoader, TranslationModule, StorageStrategy, ProviderType, LogLevel } from 'angular-l10n';


const l10nConfig: L10nConfig = {
  logger: {
    level: LogLevel.Warn
  },
  locale: {
    languages: [
      { code: 'en', dir: 'ltr' },
      { code: 'it', dir: 'ltr' }
    ],
    language: 'en',
    storage: StorageStrategy.Cookie
  },
  translation: {
    providers: [
      { type: ProviderType.Static, prefix: './assets/l10n/locale-' }
    ],
    caching: true,
    composedKeySeparator: '.',
    missingValue: 'No key'
  }
};

@NgModule({
  imports: [TranslationModule.forRoot(l10nConfig)],
  exports: [TranslationModule]
})
export class AppTranslationModule { }
