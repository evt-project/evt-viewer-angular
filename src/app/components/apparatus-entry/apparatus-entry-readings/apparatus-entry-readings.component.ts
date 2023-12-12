import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApparatusEntry, Reading } from 'src/app/models/evt-models';
import { register } from 'src/app/services/component-register.service';
import { EVTModelService } from 'src/app/services/evt-model.service';

@Component({
  selector: 'evt-apparatus-entry-readings',
  templateUrl: './apparatus-entry-readings.component.html',
  styleUrls: ['./apparatus-entry-readings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

@register(ApparatusEntryReadingsComponent)
export class ApparatusEntryReadingsComponent {
  @Input() data: ApparatusEntry;
  @Input() rdgHasCounter: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() template: TemplateRef<any>;
  @Input() selectedLayer: string;

  groups$ = this.evtModelService.groups$;

  constructor(
    public evtModelService: EVTModelService,
  ) {
  }

  get significantRdg(): Reading[] {
    return this.data.readings.filter((rdg) => rdg?.significant);
  }

  getWits$(witID: string): Observable<string[]> {
    return this.groups$.pipe(
      map((groups) => groups.filter((g) => g.id === witID).map((g) => g.witnesses).reduce((x, y) => ([ ...x, ...y ]), [])),
      map((groupWits) => groupWits.length > 0 ? groupWits : [witID]),
    );
  }
}
