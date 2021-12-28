import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApparatusEntry, GenericElement, Reading } from 'src/app/models/evt-models';
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
  @Input() isNested: boolean;
  @Input() nestedApps: ApparatusEntry[];
  @Input() rdgHasCounter: boolean;

  groups$ = this.evtModelService.groups$;

  constructor(
    public evtModelService: EVTModelService,
  ) {
  }

  get significantRdg(): Reading[] {
    return this.data.readings.filter((rdg) => rdg.significant);
  }

  isAppEntry(item: GenericElement | ApparatusEntry): boolean {
    return item.type === ApparatusEntry;
  }

  getNestedAppLemma(appId: string): Reading {
    return this.nestedApps.find((c) => c.id === appId).lemma;
  }

  getNestedAppPos(appId: string): number {
    const currentApp = this.nestedApps.find(nesApp => nesApp.id === appId);

    return this.nestedApps.indexOf(currentApp);
  }

  getWits$(witID: string): Observable<string[]> {
    return this.groups$.pipe(
      map((groups) => {
        const currentGroup = groups.filter((g) => g.id === witID);

        return currentGroup.map((g) => g.witnesses).reduce((x, y) => ([ ...x, ...y ]), []);
      }),
      map((groupWits) => groupWits.length > 0 ? groupWits : [witID]),
    );
  }
}
