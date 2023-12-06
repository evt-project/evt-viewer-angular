import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ApparatusEntry, ChangeLayerData, GenericElement, Reading } from '../../../models/evt-models';
import { register } from '../../../services/component-register.service';
import { EVTModelService } from '../../../services/evt-model.service';
import { distinctUntilChanged } from 'rxjs';
import { EVTStatusService } from 'src/app/services/evt-status.service';
@Component({
  selector: 'evt-apparatus-entry-detail',
  templateUrl: './apparatus-entry-detail.component.html',
  styleUrls: ['./apparatus-entry-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

@register(ApparatusEntryDetailComponent)
export class ApparatusEntryDetailComponent implements OnInit {
  @Input() data: ApparatusEntry;
  nestedApps: ApparatusEntry[] = [];
  rdgHasCounter = false;

  public orderedLayers: string[];
  public selectedLayer: string;

  get significantRdg(): Reading[] {
    return this.data.readings.filter((rdg) => rdg?.significant);
  }

  get notSignificantRdg(): Reading[] {
    return this.data.readings.filter((rdg) => !rdg.significant);
  }

  get readings(): Reading[] {
    return [this.data.lemma, ...this.significantRdg, ...this.notSignificantRdg];
  }

  get rdgMetadata() {
    return Object.keys(this.data.attributes).filter((key) => key !== 'id')
      .reduce((obj, key) => ({
        ...obj,
        [key]: this.data.attributes[key],
      }),     {});
  }

  getLayerData(changeData: ChangeLayerData) {
    this.orderedLayers = changeData?.layerOrder;
    this.selectedLayer = changeData?.selectedLayer;
  }

  constructor(
    public evtModelService: EVTModelService,
    public evtStatusService: EVTStatusService,
  ) {
  }

  ngOnInit() {
    if (this.data.nestedAppsIDs.length > 0) {
      this.recoverNestedApps(this.data);
    }
    this.evtStatusService.currentChanges$.pipe(distinctUntilChanged()).subscribe(({ next: (data) => this.getLayerData(data) }));
  }

  recoverNestedApps(app: ApparatusEntry) {
    const nesApps = app.lemma.content.filter((c: ApparatusEntry | GenericElement) => c.type === ApparatusEntry);
    nesApps.forEach((nesApp: ApparatusEntry) => {
      this.nestedApps = this.nestedApps.concat(nesApp);
      if (nesApp.nestedAppsIDs.length > 0) {
        this.recoverNestedApps(nesApp);
      }
    });
  }

  isAppEntry(item: GenericElement | ApparatusEntry): boolean {
    return item.type === ApparatusEntry;
  }

  getNestedAppLemma(appId: string): Reading {
    return this.nestedApps.find((c) => c.id === appId).lemma;
  }

  getNestedAppPos(appId: string): number {
    return this.nestedApps.findIndex((nesApp) => nesApp.id === appId);
  }
}
