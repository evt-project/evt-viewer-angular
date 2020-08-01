import { Component, OnDestroy } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfig, EditionConfig } from '../app.config';
import { ViewMode } from '../models/evt-models';
import { EVTModelService } from '../services/evt-model.service';
import { ThemesService } from '../services/themes.service';
import { EVTBtnClickEvent } from '../ui-components/button/button.component';
import { normalizeUrl } from '../utils/js-utils';

@Component({
  selector: 'evt-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent implements OnDestroy {
  public title$ = combineLatest([
    of(AppConfig?.evtSettings?.edition?.editionTitle),
    this.evtModelService.title$,
  ]).pipe(
    map(([configTitle, editionTitle]) => configTitle ?? editionTitle ?? 'defaultTitle'),
  );

  public viewModes: ViewMode[] = [];
  public currentViewMode: ViewMode;
  public mainMenuOpened = false;
  public editionConfig: EditionConfig;
  get editionHome() { return normalizeUrl(this.editionConfig.editionHome); }

  get logoUrl() {
    const customLogo = AppConfig?.evtSettings?.files?.logoUrl ?? undefined;

    return customLogo ?? '/assets/images/logo.png';
  }

  private subscriptions = [];

  constructor(
    public themes: ThemesService,
    private router: Router,
    private evtModelService: EVTModelService,
  ) {
    this.initViewModes();
    const firstRouteSub$ = this.router.events.subscribe((routingData: RouterEvent) => {
      if (!this.currentViewMode) {
        this.currentViewMode = this.viewModes.find(item => item.id === routingData.url.replace('/', ''));
      }
      firstRouteSub$.unsubscribe();
    });
    this.editionConfig = AppConfig.evtSettings.edition;
    console.log('this.editionConfig', this.editionConfig);
  }

  selectViewMode(viewMode: ViewMode) {
    this.currentViewMode = viewMode;
    let currentParams;
    try {
      currentParams = this.router.routerState.root.firstChild.snapshot.params;
    } catch (e) { currentParams = {}; }
    this.router.navigate(['/' + viewMode.id, currentParams]);
  }

  toggleMainMenu(clickEvent: EVTBtnClickEvent) {
    clickEvent.event.stopPropagation();
    this.mainMenuOpened = !this.mainMenuOpened;
  }

  handleItemClicked(itemClicked: string) {
    if (itemClicked) {
      this.mainMenuOpened = (itemClicked === 'theme' || itemClicked === 'language');
    }
  }

  // tslint:disable-next-line: variable-name
  trackViewModes(_index: number, item: ViewMode) {
    return item.id;
  }

  openEditionHome() {
    if (this.editionHome) {
      window.open(this.editionHome, '_blank');
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private initViewModes() {
    this.viewModes = [
      {
        icon: 'txt',
        iconSet: 'evt',
        id: 'readingText',
        label: 'Reading Text',
      },
      {
        icon: 'imgTxt',
        iconSet: 'evt',
        id: 'imageText',
        label: 'Image Text',
      },
      {
        icon: 'txtTxt',
        iconSet: 'evt',
        id: 'textText',
        label: 'Text Text',
      },
      {
        icon: 'collation',
        iconSet: 'evt',
        id: 'collation',
        label: 'Collation',
      },
      {
        icon: 'srcTxt',
        iconSet: 'evt',
        id: 'textSources',
        label: 'Text Sources',
      },
      {
        icon: 'versions',
        iconSet: 'evt',
        id: 'textVersions',
        label: 'Text Versions',
      },
    ];
  }
}
