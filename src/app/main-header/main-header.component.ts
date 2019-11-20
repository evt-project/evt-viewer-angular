import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ThemesService } from '../services/themes.service';
import { EditionConfig, AppConfig } from '../app.config';
import { EVTBtnClickEvent } from '../ui-components/button/button.component';

@Component({
  selector: 'evt-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit, OnDestroy {
  public viewModes: ViewMode[] = [];
  public currentViewMode: ViewMode;
  public mainMenuOpened = false;
  public editionConfig: EditionConfig;

  private subscriptions = [];

  constructor(
    public themes: ThemesService,
    private router: Router) {
    this.initViewModes();
    const firstRouteSub$ = this.router.events.subscribe((routingData: any) => {
      if (!this.currentViewMode) {
        this.currentViewMode = this.viewModes.find(item => item.id === routingData.url.replace('/', ''));
      }
      firstRouteSub$.unsubscribe();
    });
    this.editionConfig = AppConfig.evtSettings.edition;
    console.log('this.editionConfig', this.editionConfig);
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

  toggleMainMenu(clickEvent: EVTBtnClickEvent) {
    clickEvent.event.stopPropagation();
    this.mainMenuOpened = !this.mainMenuOpened;
  }

  handleItemClicked(itemClicked: string) {
    if (itemClicked) {
      this.mainMenuOpened = (itemClicked === 'theme' || itemClicked === 'language');
    }
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
