import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApparatusEntry, Reading } from 'src/app/models/evt-models';
import { register } from 'src/app/services/component-register.service';
import { EVTModelService } from 'src/app/services/evt-model.service';

@Component({
  selector: 'evt-apparatus-entry-readings',
  templateUrl: './apparatus-entry-readings.component.html',
  styleUrls: ['./apparatus-entry-readings.component.scss'],
})

@register(ApparatusEntryReadingsComponent)
export class ApparatusEntryReadingsComponent {
  @Input() data: ApparatusEntry;

  get significantRdg(): Reading[] {
    return this.data.readings.filter((rdg) => rdg.significant);
  }

  groups$ = this.evtModelService.groups$;

  getWits$(witID: string): Observable<string[]> {
    return this.groups$.pipe(
      map((groups) => {
        const currentGroup = groups.filter((g) => g.id === witID);
        return currentGroup.map((g) => g.witnesses).reduce((x,y) =>([ ...x, ...y ]), []);
      }),
      map((groupWits) => groupWits.length > 0 ? groupWits : [witID]),
    );
  }
  
  constructor(
    public evtModelService: EVTModelService,
  ) {
  }
}
