
import { Component, OnInit, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ThemesService, ColorTheme } from '../services/themes.service';
import { EvtIconInfo } from '../ui-components/icon/icon.component';
import { UiConfig, AppConfig, FileConfig } from '../app.config';

@Component({
  selector: 'evt-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit, OnDestroy {
  @Output() itemClicked = new EventEmitter<string>();
  public dynamicItems: MainMenuItem[] = [];
  public modalShown = false;
  public uiConfig: UiConfig = AppConfig.evtSettings.ui;
  public fileConfig: FileConfig = AppConfig.evtSettings.files;

  private isOpened = false;
  private subscriptions = [];
  private availableLangs = AppConfig.evtSettings.ui.availableLanguages.filter((l) => l.enabled);

  constructor(
    public themes: ThemesService,
    public translate: TranslateService,
  ) { }

  ngOnInit() {
    this.loadUiConfig();
    this.isOpened = true;
  }

  @HostListener('document:click')
  clickout() {
    if (!this.isOpened) {
      this.itemClicked.emit('close');
    }
    this.isOpened = false;
  }

  private loadUiConfig(): void {
    this.initDynamicItems();
  }

  private initDynamicItems() {
    // TODO Check if available from uiConfig
    this.dynamicItems.push({
      id: 'projectInfo',
      iconInfo: {
        icon: 'info-circle',
        additionalClasses: 'icon'
      },
      label: 'projectInfo',
      callback: this.openGlobalDialogInfo.bind(this)
    });
    this.dynamicItems.push({
      id: 'openLists',
      iconInfo: {
        icon: 'clipboard-list',
        additionalClasses: 'icon'
      },
      label: 'openLists',
      callback: this.openGlobalDialogLists.bind(this)
    });
    this.dynamicItems.push({
      id: 'bookmark',
      iconInfo: {
        icon: 'bookmark',
        additionalClasses: 'icon'
      },
      label: 'bookmark',
      callback: this.generateBookmark.bind(this)
    });
    this.dynamicItems.push({
      id: 'downloadXML',
      iconInfo: {
        icon: 'download',
        additionalClasses: 'icon'
      },
      label: 'downloadXML',
      callback: this.downloadXML.bind(this)
    });
  }

  private openGlobalDialogInfo() {
    // TODO openGlobalDialogInfo
    console.log('openGlobalDialogInfo');
    this.itemClicked.emit('globalInfo');
  }

  private openGlobalDialogLists() {
    // TODO openGlobalDialogLists
    console.log('openGlobalDialogLists');
    this.itemClicked.emit('lists');
  }

  private generateBookmark() {
    // TODO generateBookmark
    this.itemClicked.emit('bookmark');
  }

  private downloadXML() {
    // TODO downloadXML
    this.itemClicked.emit('downloadXML');
    if (this.fileConfig && this.fileConfig.editionUrls) {
      this.fileConfig.editionUrls.forEach(url => window.open(url, '_blank'));
    } else {
      alert('Loading data... \nPlease try again later.');
    }
  }

  openShortCuts() {
    // TODO openShortCuts
    this.itemClicked.emit('shortcuts');
  }

  // LANGUAGE
  selectLanguage(languageSelected: Language) {
    this.translate.use(languageSelected.code);
    this.itemClicked.emit('language');
  }

  getAvailableLanguages() {
    return this.availableLangs;
  }

  // THEMES
  selectTheme(theme: ColorTheme) {
    this.itemClicked.emit('theme');
    this.themes.selectTheme(theme);
  }

  getAvailableThemes(): ColorTheme[] {
    return this.themes.getAvailableThemes();
  }

  getCurrentTheme() {
    return this.themes.getCurrentTheme();
  }

  openEVTInfo() {
    // TODO: open info in modal
    this.itemClicked.emit('evtInfo');
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}

export interface Language {
  code: string;
  label: string;
}

export interface MainMenuItem {
  id: string;
  iconInfo: EvtIconInfo;
  label: string;
  // tslint:disable-next-line:ban-types
  callback: Function;
}
