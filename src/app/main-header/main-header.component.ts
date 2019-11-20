import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService, LocaleService, Language } from 'angular-l10n';
import { DropdownItem } from '../ui-components/dropdown/dropdown.component';
import { ColorTheme, ThemesService } from '../services/themes.service';

@Component({
  selector: 'evt-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit, OnDestroy {
  @Language() lang: string;
  public viewModes: ViewMode[] = [];
  public title = 'title';
  public modalShown = false;
  public currentViewMode: ViewMode;

  private subscriptions = [];

  constructor(
    public themes: ThemesService,
    public locale: LocaleService,
    public translation: TranslationService,
    private router: Router) {
    this.initViewModes();
    const firstRouteSub$ = this.router.events.subscribe((routingData: any) => {
      if (!this.currentViewMode) {
        this.currentViewMode = this.viewModes.find(item => item.id === routingData.url.replace('/', ''));
      }
      firstRouteSub$.unsubscribe();
    });
  }

  ngOnInit() { }

  selectViewMode(viewMode: ViewMode) {
    this.currentViewMode = viewMode;
    let currentParams;
    try {
      currentParams = this.router.routerState.root.firstChild.snapshot.params;
    } catch (e) { currentParams = {}; }
    this.router.navigate(['/' + viewMode.id, currentParams]);
  }

  // TEMP
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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
}

export interface ViewMode {
  id: string;
  icon: string;
  iconSet?: 'evt' | 'far' | 'fas';
  label: string;
}
