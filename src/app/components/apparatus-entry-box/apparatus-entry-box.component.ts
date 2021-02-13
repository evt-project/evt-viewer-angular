import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EVTModelService } from 'src/app/services/evt-model.service';
import { ApparatusEntry, Reading } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-apparatus-entry-box',
  templateUrl: './apparatus-entry-box.component.html',
  styleUrls: ['./apparatus-entry-box.component.scss']
})

@register(ApparatusEntry) // TODO: it's necessary? Has already been registered in app-entry component
export class ApparatusEntryBoxComponent {
  @Input() data: ApparatusEntry;

  groups$ = this.evtModelService.groups$;
  
  get significantRdg(): Reading[] {
    return this.data.readings.filter((rdg) => rdg.significant);
  }

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
