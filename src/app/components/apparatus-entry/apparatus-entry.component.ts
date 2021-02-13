import { Component, Input } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { ApparatusEntry } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EVTModelService } from '../../services/evt-model.service';
import { EditionlevelSusceptible } from '../components-mixins';

export interface ApparatusEntryComponent extends EditionlevelSusceptible { }
@Component({
  selector: 'evt-apparatus-entry',
  templateUrl: './apparatus-entry.component.html',
  styleUrls: ['./apparatus-entry.component.scss'],
})
@register(ApparatusEntry)
export class ApparatusEntryComponent {
  @Input() data: ApparatusEntry;

  public boxOpened = false;

  variance$ = this.evtModelService.appVariance$.pipe(
    map((variances) => variances[this.data.id]),
    shareReplay(1),
  );

  constructor(
    private evtModelService: EVTModelService,
  ) {
  }

  toggleAppEntryBox(event: MouseEvent) {
    event.stopPropagation();
    this.boxOpened = ! this.boxOpened;
  }
}
