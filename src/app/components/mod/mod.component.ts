import { Component, Input } from '@angular/core';

import { EditorialConventionLayoutData } from 'src/app/directives/editorial-convention-layout.directive';
import { ChangeLayerData, Mod } from 'src/app/models/evt-models';
import { register } from 'src/app/services/component-register.service';
import { EditionlevelSusceptible, Highlightable, ShowDeletionsSusceptible, TextFlowSusceptible } from '../components-mixins';
import { distinctUntilChanged, map, scan, startWith, Subject } from 'rxjs';
import { EVTStatusService } from 'src/app/services/evt-status.service';
import { AppConfig } from 'src/app/app.config';
import { ChangeDetectionStrategy } from '@angular/core';

export interface ModComponent extends EditionlevelSusceptible, Highlightable, TextFlowSusceptible, ShowDeletionsSusceptible { }

@Component({
  selector: 'evt-mod',
  templateUrl: './mod.component.html',
  styleUrls: ['./mod.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})

@register(Mod)
export class ModComponent {

  @Input() data: Mod;

  public orderedLayers: string[];

  public selectedLayer: string;

  public selectedLayer$ = this.evtStatusService.currentChanges$.pipe(
    distinctUntilChanged(),
    map(({ selectedLayer }) => {
      this.selectedLayer = selectedLayer;

      return selectedLayer;
    } ),
  );


  public opened = false;

  public isVisible = this.layerVisible;

  public changeLayerColor = this.getLayerColor;

  toggleOpened$ = new Subject<boolean | void>();
  opened$ = this.toggleOpened$.pipe(
    scan((currentState: boolean, val: boolean | undefined) => val === undefined ? !currentState : val, false),
    startWith(false),
  );

  get editorialConventionData(): EditorialConventionLayoutData {
    return {
      name: 'mod',
      attributes: this.data?.attributes || {},
      editionLevel: this.editionLevel,
      defaultsKey: 'mod',
    };
  }

  getLayerData(data: ChangeLayerData) {
    this.orderedLayers = data?.layerOrder;
    this.selectedLayer = data?.selectedLayer;
  }

  getLayerColor() {
    const layerColors = AppConfig.evtSettings.edition.changeSequenceView.layerColors;
    if ((this.data?.changeLayer) && (layerColors[this.data.changeLayer.replace('#','')])) {
      return layerColors[this.data.changeLayer.replace('#','')];
    }

    return 'black';
  }

  getLayerIndex(layer): number {
    layer = layer.replace('#','');

    return this.orderedLayers.indexOf(layer);
  }

  layerVisible() {
    if (this.editionLevel !== 'changesView') {
      return true;
    }
    this.evtStatusService.currentChanges$.subscribe(({ next: (data) => this.getLayerData(data) }));
    console.log('visible?',this.selectedLayer, this.editionLevel, this.data)
    if (this.selectedLayer !== undefined) {
      console.log('checking...', this.data.isRdg, this.data.changeLayer);
      if (this.getLayerIndex(this.selectedLayer) > this.getLayerIndex(this.data.changeLayer)) {
        console.log('hidden', this.data.changeLayer, this.data);
        // changes not marked as lem are hidden if not in critical edition
        // todo: selectedLayer
        // todo: hide deleted text?
        return false;
      }
    }

    return true;
  }

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  constructor(
    public evtStatusService: EVTStatusService,
  ) {}


}
