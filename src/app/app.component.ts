import { Component, OnInit } from '@angular/core';
import { LocaleService, TranslationService, Language } from 'angular-l10n';
import { ThemesService, ColorTheme } from './services/themes.service';

@Component({
  selector: 'evt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Language() lang: string;
  title: string;

  constructor(
    public themes: ThemesService,
    public locale: LocaleService,
    public translation: TranslationService) { }


  ngOnInit(): void {
    this.translation.translationChanged().subscribe(
      () => { this.title = this.translation.translate('title'); }
    );
  }

  getAvailableLanguages() {
    return [{
      code: 'en',
      label: 'languageEn'
    }, {
      code: 'it',
      label: 'languageIt'
    }];
  }

  selectLanguage(language: string): void {
    this.locale.setCurrentLanguage(language);
  }

  getCurrentLanguage() {
    return this.locale.getCurrentLanguage();
  }

  // TEMP
  selectTheme(theme: ColorTheme) {
    console.log('selectTheme', theme);
    this.themes.selectTheme(theme);
  }

  getAvailableThemes(): ColorTheme[] {
    return this.themes.getAvailableThemes();
  }

  getCurrentTheme() {
    return this.themes.getCurrentTheme();
  }
}
