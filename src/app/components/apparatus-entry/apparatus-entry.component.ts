import { ChangeDetectionStrategy, Component, Input, OnInit, Optional, SkipSelf } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { ApparatusEntry, GenericElement } from '../../models/evt-models';
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
export class ApparatusEntryComponent implements OnInit {
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
    @Optional() @SkipSelf() private parentDetailComponent?: ApparatusEntryDetailComponent,
  ) {
    this.isInsideAppDetail = this.parentDetailComponent ? true : false;
  }

  ngOnInit() {
    if (this.data.hasNestedApp) {
      this.recoverNestedApps(this.data);
    }
  }

  recoverNestedApps(app: ApparatusEntry) {
    const nesApps = app.lemma.content.filter((c: ApparatusEntry | GenericElement) => c.type === ApparatusEntry);
    nesApps.forEach((nesApp: ApparatusEntry) => {
      this.nestedApps = this.nestedApps.concat(nesApp);
      if (nesApp.hasNestedApp) {
        this.recoverNestedApps(nesApp);
      }
    });
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
