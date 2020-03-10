import { Component, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { AppConfig, EditionLevel, EditionLevelType } from '../../app.config';
import { EvtIconInfo } from '../../ui-components/icon/icon.component';

@Component({
  selector: 'evt-edition-level-selector',
  templateUrl: './edition-level-selector.component.html',
  styleUrls: ['./edition-level-selector.component.scss'],
})
export class EditionLevelSelectorComponent {
  editionLevels = (AppConfig.evtSettings.edition.availableEditionLevels || []).filter((el) => !el.disabled);
  private elId: EditionLevelType;
  @Input() set editionLevel(v: EditionLevelType) {
    this.elId = v;
    this.selectedEditionLevel$.next(this.editionLevels.find(e => e.id === this.elId));
  }
  get editionLevel() { return this.elId; }

  selectedEditionLevel$ = new BehaviorSubject<EditionLevel>(undefined);

  @Output() selectionChange = this.selectedEditionLevel$.pipe(
    distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y)),
    map(el => el?.id),
  );

  icon: EvtIconInfo = {
    icon: 'layer-group', // TODO: Choose better icon
    additionalClasses: 'mr-2',
  };
}
