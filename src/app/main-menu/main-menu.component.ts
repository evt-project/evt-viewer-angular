
import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { map, Observable, of } from 'rxjs';

import { AppConfig, DownloadLinks } from '../app.config';
import { ProjectInfoComponent } from '../components/project-info/project-info.component';
import { EvtInfoComponent } from '../evt-info/evt-info.component';
import { ColorTheme, ThemesService } from '../services/themes.service';
import { ShortcutsComponent } from '../shortcuts/shortcuts.component';
import { EvtIconInfo } from '../ui-components/icon/icon.component';
import { ModalComponent } from '../ui-components/modal/modal.component';
import { ModalService } from '../ui-components/modal/modal.service';
import { EVTModelService } from '../services/evt-model.service';

@Component({
  selector: 'evt-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent {
  @Output() itemClicked = new EventEmitter<string>();

  public readonly dynamicItems: MainMenuItem[] = this.getDynamicItems();
  public readonly uiConfig = AppConfig.evtSettings.ui;
  public readonly editionTextSources = AppConfig.evtSettings.editionTextSources;
  public readonly editionConfig = AppConfig.evtSettings.edition;
  public readonly availableLangs = AppConfig.evtSettings.ui.availableLanguages.filter((l) => l.enable);
  public readonly downloadLinks = AppConfig.evtSettings.edition.mainMenuConfig.downloadLinks;
  private isOpened = true;

  constructor(
    public themes: ThemesService,
    public translate: TranslateService,
    private modalService: ModalService,
    private evtModelService: EVTModelService,
  ) {
    this.dynamicItems = this.getDynamicItems();
  }

  closeMenu() {
    if (this.isOpened) {
      this.isOpened = false;
      this.itemClicked.emit('close');
    }
  }

  private getDynamicItems(): MainMenuItem[] {
    // TODO Check if available from uiConfig
    return [
      {
        id: 'projectInfo',
        iconInfo: {
          icon: 'info-circle',
          additionalClasses: 'icon',
        },
        label: 'projectInfo',
        enabled$: of(true),
        callback: () => this.openGlobalDialogInfo(),
      },
      {
        id: 'openLists',
        iconInfo: {
          icon: 'clipboard-list',
          additionalClasses: 'icon',
        },
        label: 'openLists',
        enabled$: this.evtModelService.namedEntities$.pipe(
          map((ne) => this.editionConfig.mainMenuConfig.showEntitiesLists && ne.all.entities.length > 0),
        ),
        callback: () => this.openGlobalDialogLists(),
      },
      {
        id: 'bookmark',
        iconInfo: {
          icon: 'bookmark',
          additionalClasses: 'icon',
        },
        label: 'bookmark',
        enabled$: of(true),
        callback: () => this.generateBookmark(),
      },
      {
        id: 'downloadXML',
        iconInfo: {
          icon: 'download',
          additionalClasses: 'icon',
        },
        label: 'downloadXML',
        enabled$: of(AppConfig.evtSettings.edition.mainMenuConfig.downloadableXMLSource),
        callback: () => this.downloadXML(),
      },
    ];
  }

  private openGlobalDialogInfo() {
    this.itemClicked.emit('globalInfo');
    const modalRef = this.modalService.open(ModalComponent, { id: 'project-info', animation: false });
    const modalComp = modalRef.componentInstance as ModalComponent;
    modalComp.fixedHeight = true;
    modalComp.wider = true;
    modalComp.modalId = 'project-info';
    modalComp.title = 'projectInfo';
    modalComp.bodyContentClass = 'p-0 h-100';
    modalComp.headerIcon = { icon: 'info', iconSet: 'fas', additionalClasses: 'me-3' };
    modalComp.bodyComponent = ProjectInfoComponent;
  }

  private openGlobalDialogLists() {
    this.itemClicked.emit('lists');
    this.modalService.openGlobalLists();
  }

  private generateBookmark() {
    // TODO generateBookmark
    this.itemClicked.emit('bookmark');
  }

  private downloadXML() {
    // TODO downloadXML
    this.itemClicked.emit('downloadXML');
    this.editionTextSources.forEach((s) => window.open(s.url, '_blank'));
  }

  public download(link: DownloadLinks) {
    this.itemClicked.emit('download');
    window.open(link.url, '_blank');
  }

  openShortCuts() {
    this.itemClicked.emit('shortcuts');
    const modalRef = this.modalService.open(ModalComponent, { id: 'shortcuts' });
    const modalComp = modalRef.componentInstance as ModalComponent;
    modalComp.fixedHeight = true;
    modalComp.modalId = 'shortcuts';
    modalComp.title = 'shortcuts';
    modalComp.bodyContentClass = 'p-3';
    modalComp.headerIcon = { icon: 'keyboard', iconSet: 'fas', additionalClasses: 'me-3' };
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
    modalComp.headerIcon = { icon: 'copyright', iconSet: 'fas', additionalClasses: 'me-3' };
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

}

export interface Language {
  code: string;
  label: string;
}

export interface MainMenuItem {
  id: string;
  iconInfo: EvtIconInfo;
  label: string;
  enabled$: Observable<boolean>;
  callback: () => void;
}
