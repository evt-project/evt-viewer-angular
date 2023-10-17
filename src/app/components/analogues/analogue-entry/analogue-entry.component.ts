import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { scan, startWith } from 'rxjs/operators';

import { EditorialConventionDefaults } from 'src/app/services/editorial-conventions.service';
import { EditorialConventionLayoutData } from '../../../directives/editorial-convention-layout.directive';

import { ParallelPassage } from '../../../models/evt-models';
import { register } from '../../../services/component-register.service';
import { EVTStatusService } from '../../../services/evt-status.service';
import { EditionlevelSusceptible, TextFlowSusceptible } from '../../components-mixins';

export interface AnalogueEntryComponent extends EditionlevelSusceptible, TextFlowSusceptible { }

@Component({
  selector: 'evt-analogue-entry',
  templateUrl: './analogue-entry.component.html',
  styleUrls: ['./analogue-entry.component.scss','../../sources/sources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@register(ParallelPassage)
export class AnalogueEntryComponent {

  @Input() data: ParallelPassage;

  public opened = false;

  toggleOpened$ = new Subject<boolean | void>();
  opened$ = this.toggleOpened$.pipe(
    scan((currentState: boolean, val: boolean | undefined) => val === undefined ? !currentState : val, false),
    startWith(false),
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

  toggleAppEntryBox(e: MouseEvent) {
    e.stopPropagation();
    console.log('ho aperto');
    this.opened = !this.opened;
  }

  closeAppEntryBox() {
    this.opened = false;
  }

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  constructor(
    public evtStatusService: EVTStatusService,
  ) {
  }

}
