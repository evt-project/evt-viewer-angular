
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AppConfig, FileConfig, UiConfig } from '../app.config';
import { EvtInfoComponent } from '../evt-info/evt-info.component';
import { register } from '../services/component-register.service';
import { ColorTheme, ThemesService } from '../services/themes.service';
import { ShortcutsComponent } from '../shortcuts/shortcuts.component';
import { EvtIconInfo } from '../ui-components/icon/icon.component';
import { ModalComponent } from '../ui-components/modal/modal.component';
import { ModalService } from '../ui-components/modal/modal.service';

@Component({
  selector: 'evt-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
@register
export class MainMenuComponent implements OnInit, OnDestroy {
  @Output() itemClicked = new EventEmitter<string>();
  public dynamicItems: MainMenuItem[] = [];
  public uiConfig: UiConfig = AppConfig.evtSettings.ui;
  public fileConfig: FileConfig = AppConfig.evtSettings.files;

  private isOpened = false;
  private subscriptions = [];
  private availableLangs = AppConfig.evtSettings.ui.availableLanguages.filter((l) => l.enabled);

  constructor(
    public themes: ThemesService,
    public translate: TranslateService,
    private modalService: ModalService,
  ) {
  }

  ngOnInit() {
    this.loadUiConfig();
    this.isOpened = true;
  }

  closeMenu() {
    if (this.isOpened) {
      this.isOpened = false;
      this.itemClicked.emit('close');
    }
  }

  private loadUiConfig(): void {
    this.initDynamicItems();
  }

  private initDynamicItems() {
    // TODO Check if available from uiConfig
    this.dynamicItems = [
      {
        id: 'projectInfo',
        iconInfo: {
          icon: 'info-circle',
          additionalClasses: 'icon',
        },
        label: 'projectInfo',
        // callback: () => this.openGlobalDialogInfo,
        callback: () => this.openGlobalDialogInfo(),
      },
      {
        id: 'openLists',
        iconInfo: {
          icon: 'clipboard-list',
          additionalClasses: 'icon',
        },
        label: 'openLists',
        callback: () => this.openGlobalDialogLists(),
      },
      {
        id: 'bookmark',
        iconInfo: {
          icon: 'bookmark',
          additionalClasses: 'icon',
        },
        label: 'bookmark',
        callback: () => this.generateBookmark(),
      },
      {
        id: 'downloadXML',
        iconInfo: {
          icon: 'download',
          additionalClasses: 'icon',
        },
        label: 'downloadXML',
        callback: () => this.downloadXML(),
      },
    ];
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
    this.itemClicked.emit('shortcuts');
    const modalRef = this.modalService.open(ModalComponent, { id: 'shortcuts' });
    const modalComp = modalRef.componentInstance as ModalComponent;
    modalComp.fixedHeight = true;
    modalComp.modalId = 'shortcuts';
    modalComp.title = 'shortcuts';
    modalComp.bodyContentClass = 'p-3';
    modalComp.headerIcon = { icon: 'keyboard', iconSet: 'fas', additionalClasses: 'mr-3' };
    modalComp.bodyComponent = ShortcutsComponent;
  }

  // LANGUAGE
  selectLanguage(event: MouseEvent, languageSelected: Language) {
    event.stopPropagation();
    this.translate.use(languageSelected.code);
    this.itemClicked.emit('language');
  }

  getAvailableLanguages() {
    return this.availableLangs;
  }

  // THEMES
  selectTheme(event: MouseEvent, theme: ColorTheme) {
    event.stopPropagation();
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
    this.itemClicked.emit('evtInfo');
    const modalRef = this.modalService.open(ModalComponent, { id: 'evtInfo' });
    const modalComp = modalRef.componentInstance as ModalComponent;
    modalComp.fixedHeight = true;
    modalComp.modalId = 'evtInfo';
    modalComp.title = 'aboutEVT';
    modalComp.bodyContentClass = 'p-3';
    modalComp.headerIcon = { icon: 'copyright', iconSet: 'fas', additionalClasses: 'mr-3' };
    modalComp.bodyComponent = EvtInfoComponent;
  }

  // tslint:disable-next-line: variable-name
  trackMenuItem(_index: number, item: MainMenuItem) {
    return item.id;
  }

  // tslint:disable-next-line: variable-name
  trackLanguages(_index: number, item: Language) {
    return item.code;
  }

  // tslint:disable-next-line: variable-name
  trackTheme(_index: number, item: ColorTheme) {
    return item.value;
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
  callback: () => void;
}
