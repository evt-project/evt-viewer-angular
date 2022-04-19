import { ChangeDetectionStrategy, Component, Input, Optional } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { ApparatusEntry } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EVTModelService } from '../../services/evt-model.service';
import { ApparatusEntryDetailComponent } from './apparatus-entry-detail/apparatus-entry-detail.component';
@Component({
  selector: 'evt-apparatus-entry',
  templateUrl: './apparatus-entry.component.html',
  styleUrls: ['./apparatus-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@register(ApparatusEntry)
export class ApparatusEntryComponent {
  @Input() data: ApparatusEntry;

  public opened = false;
  public isInsideAppDetail: boolean;
  public nestedApps: ApparatusEntry[] = [];

  variance$ = this.evtModelService.appVariance$.pipe(
    map((variances) => variances[this.data.id]),
    shareReplay(1),
  );

  constructor(
    private evtModelService: EVTModelService,
    @Optional() private parentDetailComponent?: ApparatusEntryDetailComponent,
  ) {
    this.isInsideAppDetail = this.parentDetailComponent ? true : false;
  }

  toggleAppEntryBox(e: MouseEvent) {
    e.stopPropagation();
    this.opened = !this.opened;
  }

  closeAppEntryBox() {
    this.opened = false;
  }

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }
}
