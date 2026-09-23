import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfig, EditionConfig } from '../app.config';
import { ViewMode } from '../models/evt-models';
import { EVTModelService } from '../services/evt-model.service';
import { EVTStatusService } from '../services/evt-status.service';
import { ThemesService } from '../services/themes.service';
import { normalizeUrl } from '../utils/js-utils';
import { EVTBtnClickEvent } from '../ui-components/button/button.component';

@Component({
  selector: 'evt-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainHeaderComponent {
  public title$ = combineLatest([
    of(AppConfig?.evtSettings?.edition?.editionTitle),
    this.evtModelService.currentEditionTitle$,
  ]).pipe(
    map(([configTitle, editionTitle]) => configTitle ?? editionTitle ?? 'defaultTitle'),
  );

  public viewModes: ViewMode[] = AppConfig.evtSettings.ui.availableViewModes?.filter(((e) => e.enable)) ?? [];
  public currentViewMode$ = this.evtStatusService.currentViewMode$;
  public mainMenuOpened = false;
  public editionConfig: EditionConfig = AppConfig.evtSettings.edition;
  editionHome = normalizeUrl(this.editionConfig.editionHome);
  logoUrl = AppConfig.evtSettings.edition.logoUrl;

  constructor(
    public themes: ThemesService,
    private evtModelService: EVTModelService,
    private evtStatusService: EVTStatusService,
  ) {
  }

  setDefaultLogo() {
    this.logoUrl = 'assets/images/logo_white.png';
  }

  selectViewMode(viewMode: ViewMode) {
    this.evtStatusService.updateViewMode$.next(viewMode);
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
}
