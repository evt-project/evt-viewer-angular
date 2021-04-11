import { Component, Input, Optional, SkipSelf } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { ApparatusEntry } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EVTModelService } from '../../services/evt-model.service';
import { EditionlevelSusceptible } from '../components-mixins';
import { ApparatusEntryDetailComponent } from './apparatus-entry-detail/apparatus-entry-detail.component';

export interface ApparatusEntryComponent extends EditionlevelSusceptible { }
@Component({
  selector: 'evt-apparatus-entry',
  templateUrl: './apparatus-entry.component.html',
  styleUrls: ['./apparatus-entry.component.scss'],
})
@register(ApparatusEntry)
export class ApparatusEntryComponent {
  @Input() data: ApparatusEntry;

  public opened = false;
  public isNestedInApp: boolean;

  variance$ = this.evtModelService.appVariance$.pipe(
    map((variances) => variances[this.data.id]),
    shareReplay(1),
  );

  constructor(
    private evtModelService: EVTModelService,
    @Optional() @SkipSelf() private parentDetailComponent?: ApparatusEntryDetailComponent,
  ) {
    this.isNestedInApp = this.parentDetailComponent ? true : false;
  }

  toggleAppEntryBox(e: MouseEvent) {
    e.stopPropagation();
    this.opened = !this.opened;
  }

  closeAppEntryBox() {
    if (this.opened) {
      this.opened = false;
    }
  }
}
