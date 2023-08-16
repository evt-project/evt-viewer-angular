import { Component, Input } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { map, scan, startWith } from 'rxjs/operators';

import { EditorialConventionDefaults } from 'src/app/services/editorial-conventions.service';
import { EditorialConventionLayoutData } from '../../directives/editorial-convention-layout.directive';

import { ParallelPassage } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EVTStatusService } from '../../services/evt-status.service';
import { EditionlevelSusceptible, Highlightable, TextFlowSusceptible } from '../components-mixins';

export interface AnalogueEntryComponent extends EditionlevelSusceptible, Highlightable, TextFlowSusceptible { }

@Component({
  selector: 'evt-analogue-entry',
  templateUrl: './analogue-entry.component.html',
  styleUrls: ['./analogue-entry.component.scss'],
})
@register(ParallelPassage)
export class AnalogueEntryComponent {
  @Input() data: ParallelPassage;

  toggleOpened$ = new Subject<boolean | void>();
  opened$ = this.toggleOpened$.pipe(
    scan((currentState: boolean, val: boolean | undefined) => val === undefined ? !currentState : val, false),
    startWith(false),
  );

  quoteHighlight$ = combineLatest([
    this.opened$,
    this.evtStatusService.currentQuotedId$,
  ]).pipe(
    map(([opened, currentId]) => currentId === this.data.id && !opened),
  );

  get editorialConventionData(): EditorialConventionLayoutData {
    return {
      name: 'analoguePassage',
      attributes: this.data?.attributes || {},
      editionLevel: this.editionLevel,
      defaultsKey: this.defaultsKey,
    };
  }

  get defaultsKey(): EditorialConventionDefaults {
    return 'analoguePassage';
  }

  constructor(
    public evtStatusService: EVTStatusService,
  ) {
  }

}
