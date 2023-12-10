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
  public editionLevels = (AppConfig.evtSettings.edition.availableEditionLevels || []).filter((el) => el.enable);
  public selectableEditionLevels = this.editionLevels.filter((el) => !el.hidden);

  // tslint:disable-next-line: variable-name
  private _edLevelID: EditionLevelType;
  @Input() set editionLevelID(p: EditionLevelType) {
    this._edLevelID = p;
    this.selectedEditionLevel$.next(this._edLevelID);
  }
  get editionLevelID() { return this._edLevelID; }

  selectedEditionLevel$ = new BehaviorSubject<EditionLevelType>(undefined);

  @Output() selectionChange = combineLatest([
    of(this.editionLevels),
    this.selectedEditionLevel$.pipe(distinctUntilChanged()),
  ]).pipe(
    filter(([edLevels, edLevelID]) => !!edLevelID && !!edLevels && edLevels.length > 0),
    map(([edLevels, edLevelID]) => !!edLevelID ? edLevels.find((p) => p.id === edLevelID) || edLevels[0] : edLevels[0]),
    filter((e) => !!e),
  );

  icon: EvtIconInfo = {
    icon: 'layer-group', // TODO: Choose better icon
    additionalClasses: 'me-2',
  };

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }
}
