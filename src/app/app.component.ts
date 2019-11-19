import { Component, OnInit, HostBinding } from '@angular/core';
import { LocaleService, TranslationService, Language } from 'angular-l10n';
import { ThemesService, ColorTheme } from './services/themes.service';
import { DropdownItem } from './ui-components/dropdown/dropdown.component';

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

  @HostBinding('attr.data-theme') get dataTheme() { return this.getCurrentTheme().value; }

  ngOnInit(): void {
    this.translation.translationChanged().subscribe(
      () => { this.title = this.translation.translate('title'); }
    );
  }

  getAvailableLanguages(): DropdownItem[] {
    return [{
      id: 'en',
      label: 'languageEn',
      title: 'languageEn'
    }, {
      id: 'it',
      label: 'languageIt',
      title: 'languageIt'
    }];
  }

  selectLanguage(languageSelected: DropdownItem[]): void {
    this.locale.setCurrentLanguage(languageSelected[0].id);
  }

  getCurrentLanguage() {
    return this.getAvailableLanguages().find(language => language.id === this.locale.getCurrentLanguage());
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
