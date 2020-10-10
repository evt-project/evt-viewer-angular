import { Component, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApparatusEntry } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EVTModelService } from '../../services/evt-model.service';
import { EditionlevelSusceptible, Highlightable } from '../components-mixins';

export interface ApparatusEntryComponent extends EditionlevelSusceptible, Highlightable { }

@Component({
  selector: 'evt-apparatus-entry',
  templateUrl: './apparatus-entry.component.html',
  styleUrls: ['./apparatus-entry.component.scss'],
})
@register(ApparatusEntry)
export class ApparatusEntryComponent {
  @Input() data: ApparatusEntry;

  variance$ = this.evtModelService.appVariance$.pipe(
    map((variances) => variances[this.data.id]),
  );

  constructor(
    private evtModelService: EVTModelService,
  ) {
  }
}
