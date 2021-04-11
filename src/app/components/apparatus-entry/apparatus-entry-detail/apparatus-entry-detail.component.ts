import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EVTModelService } from '../../../services/evt-model.service';
import { ApparatusEntry, GenericElement, Reading } from '../../../models/evt-models';
import { register } from '../../../services/component-register.service';

@Component({
  selector: 'evt-apparatus-entry-detail',
  templateUrl: './apparatus-entry-detail.component.html',
  styleUrls: ['./apparatus-entry-detail.component.scss'],
})

@register(ApparatusEntryDetailComponent)
export class ApparatusEntryDetailComponent {
  @Input() data: ApparatusEntry;

  groups$ = this.evtModelService.groups$;

  get significantRdg(): Reading[] {
    return this.data.readings.filter((rdg) => rdg.significant);
  }
  
  get notSignificantRdg(): Reading[] {
    return this.data.readings.filter((rdg) => !rdg.significant);
  }

  get readings(): Reading[] {
    return [this.data.lemma].concat(this.significantRdg).concat(this.notSignificantRdg);
  }

  get witAttr(): string {
    return this.data.attributes.wit;
  }

  get nestedApps(): ApparatusEntry[] {
    return this.data.lemma.content.filter((c: GenericElement) => c.type === ApparatusEntry) as ApparatusEntry[];
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
