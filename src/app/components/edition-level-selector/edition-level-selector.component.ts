import { Component, Input, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { AppConfig, EditionLevelType } from '../../app.config';
import { EvtIconInfo } from '../../ui-components/icon/icon.component';

@Component({
  selector: 'evt-edition-level-selector',
  templateUrl: './edition-level-selector.component.html',
  styleUrls: ['./edition-level-selector.component.scss'],
})
export class EditionLevelSelectorComponent {

  public editionLevels = (AppConfig.evtSettings.edition.availableEditionLevels || []).filter((el) => !el.disabled);
  selectedEditionLevel$ = new BehaviorSubject<EditionLevelType>(undefined);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Output() selectionChange = combineLatest([
    of(this.editionLevels),
    this.selectedEditionLevel$.pipe(distinctUntilChanged()),
  ]).pipe(
    filter(([edLevels, edLevelID]) => !!edLevelID && !!edLevels && edLevels.length > 0),
    map(([edLevels, edLevelID]) => !!edLevelID ? edLevels.find(p => p.id === edLevelID) || edLevels[0] : edLevels[0]),
    filter(e => !!e),
  );


  icon: EvtIconInfo = {
    icon: 'layer-group', // TODO: Choose better icon
    additionalClasses: 'mr-2',
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  private inner_edLevelID: EditionLevelType;
  @Input() set editionLevelID(p: EditionLevelType) {
    this.inner_edLevelID = p;
    this.selectedEditionLevel$.next(this.inner_edLevelID);
  }
  get editionLevelID() { return this.inner_edLevelID; }
}
