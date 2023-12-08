import { Component, Input, OnInit } from '@angular/core';
import { EvtIconInfo } from '../../ui-components/icon/icon.component';
import { EVTStatusService } from 'src/app/services/evt-status.service';
import { distinctUntilChanged } from 'rxjs';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'evt-change-layer-selector',
  templateUrl: './change-layer-selector.component.html',
  styleUrls: ['./change-layer-selector.component.scss'],
})
export class ChangeLayerSelectorComponent implements OnInit {

  public changeLayers;

  public selectedLayer: string;

  @Input() set selLayer(l: string) {
    this.selectedLayer = l;
    this.evtStatusService.updateLayer$.next(l)
  }
  get editionLevelID() { return this.selectedLayer; }

  icon: EvtIconInfo = {
    icon: 'clock',
    additionalClasses: 'me-2',
  };

  getLayerData(data) {
    let layerItems = [];
    this.changeLayers = data?.layerOrder;
    data?.layerOrder.forEach((layer) => layerItems.push({ id: layer, value: layer }));
    this.changeLayers = layerItems;
    this.selectedLayer = data?.selectedLayer;
  }

  getLayerColor(layer) {
    const layerColors = AppConfig.evtSettings.edition.changeSequenceView.layerColors;
    if ((layer !== undefined) && (layerColors[layer.replace('#','')])) {
      return layerColors[layer.replace('#','')];
    }

    return 'black';
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  constructor(
    public evtStatusService: EVTStatusService,
  ) {}

  ngOnInit() {
    this.evtStatusService.currentChanges$.pipe(distinctUntilChanged()).subscribe(({ next: (data) => this.getLayerData(data) }));
  }

}
