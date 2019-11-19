import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { LocaleService, TranslationService, Language } from 'angular-l10n';
import { ThemesService, ColorTheme } from './services/themes.service';
import { DropdownItem } from './ui-components/dropdown/dropdown.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'evt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @Language() lang: string;
  title: string;
  modalShown = false;
  viewModes: ViewMode[] = [];
  public currentViewMode: ViewMode;
  private subscriptions: Subscription[] = [];

  constructor(
    public themes: ThemesService,
    public locale: LocaleService,
    private router: Router,
    public translation: TranslationService) {
    // TEMP
    const firstRouteSub$ = this.router.events.subscribe((routingData: any) => {
      if (!this.currentViewMode) {
        this.currentViewMode = this.viewModes.find(item => item.id === routingData.url.replace('/', ''));
      }
      firstRouteSub$.unsubscribe();
    });
  }
  @HostBinding('attr.data-theme') get dataTheme() { return this.getCurrentTheme().value; }

  ngOnInit(): void {
    this.subscriptions.push(this.translation.translationChanged().subscribe(
      () => { this.title = this.translation.translate('title'); }
    ));
    this.initViewModes();
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

  showModal() {
    this.modalShown = true;
  }

  hideModal() {
    this.modalShown = false;
  }

  selectViewMode(viewMode: ViewMode) {
    this.currentViewMode = viewMode;
    let currentParams;
    try {
      currentParams = this.router.routerState.root.firstChild.snapshot.params;
    } catch (e) { currentParams = {}; }
    this.router.navigate(['/' + viewMode.id, currentParams]);
  }

  private initViewModes() {
    this.viewModes.push({
      icon: 'txt',
      iconSet: 'evt',
      id: 'readingText',
      label: 'Reading Text'
    });
    this.viewModes.push({
      icon: 'imgTxt',
      iconSet: 'evt',
      id: 'imageText',
      label: 'Image Text'
    });
    this.viewModes.push({
      icon: 'txtTxt',
      iconSet: 'evt',
      id: 'textText',
      label: 'Text Text'
    });
    this.viewModes.push({
      icon: 'collation',
      iconSet: 'evt',
      id: 'collation',
      label: 'Collation'
    });
    this.viewModes.push({
        icon: 'srcTxt',
        iconSet: 'evt',
        id: 'textSources',
        label: 'Text Sources'
    });
    this.viewModes.push({
        icon: 'versions',
        iconSet: 'evt',
        id: 'textVersions',
        label: 'Text Versions'
    });
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}

export interface ViewMode {
  id: string;
  icon: string;
  iconSet?: 'evt' | 'far' | 'fas';
  label: string;
}
