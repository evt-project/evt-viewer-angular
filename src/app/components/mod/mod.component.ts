import { Component, Input } from '@angular/core';

import { EditorialConventionLayoutData } from 'src/app/directives/editorial-convention-layout.directive';
import { ChangeLayerData, GenericElement, Mod, Note } from 'src/app/models/evt-models';
import { register } from 'src/app/services/component-register.service';
import { EditionlevelSusceptible, Highlightable, ShowDeletionsSusceptible, TextFlowSusceptible } from '../components-mixins';
import { distinctUntilChanged, map, scan, startWith, Subject } from 'rxjs';
import { EVTStatusService } from 'src/app/services/evt-status.service';
import { ErrorsService } from 'src/app/services/errors.service';
import { AppConfig, EditionLevelType } from 'src/app/app.config';

export interface ModComponent extends EditionlevelSusceptible, Highlightable, TextFlowSusceptible, ShowDeletionsSusceptible { }

@Component({
  selector: 'evt-mod',
  templateUrl: './mod.component.html',
  styleUrls: ['./mod.component.scss'],
})

@register(Mod)
export class ModComponent {

  @Input() data: Mod;

  @Input() editionLevel: EditionLevelType;

  @Input() withDeletions: boolean;

  public alwaysShow: boolean;

  @Input() set alwaysShown(yes: boolean) {
    this.alwaysShow = yes;
  }
  get alwaysShown() { return this.alwaysShow; }

  public changeSeparatorVisible = AppConfig.evtSettings.edition.showSeparatorBetweenChanges;

  public showLayerMarkers = AppConfig.evtSettings.edition.showChangeLayerMarkerInText;

  public elementsToExcludeInTextFlow = [Note];

  public orderedLayers: string[];

  public selectedLayer: string;

  public selectedLayer$ = this.evtStatusService.currentChanges$.pipe(
    distinctUntilChanged(),
    map(({ selectedLayer, layerOrder }) => {
      this.selectedLayer = selectedLayer;
      this.orderedLayers = layerOrder;
      if (layerOrder.length > 0) {
        this.selectedLayer = this.selectedLayer ?? layerOrder[layerOrder.length-1];
      }

      return selectedLayer;
    } ),
  );

  public isHidden = this.layerHidden;

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
      editionLevel: this.editionLevel || 'diplomatic',
    };
  }

  setLayerData(data: ChangeLayerData) {
    this.orderedLayers = data?.layerOrder;
    this.selectedLayer = data?.selectedLayer;
    if (this.orderedLayers.length > 0) {
      // default selected layer
      this.selectedLayer = this.selectedLayer ?? this.orderedLayers[this.orderedLayers.length-1];
    }
  }

  getLayerColor(): string {
    const layerColors = AppConfig.evtSettings.edition.changeSequenceView.layerColors;
    if ((this.data?.changeLayer) && (layerColors[this.data.changeLayer.replace('#','')])) {
      return layerColors[this.data.changeLayer.replace('#','')];
    } else if (this.data.changeLayer !== null) {
      this.errorService.logWarning(`Change layer ${this.data.changeLayer} color not defined in config file. Black is used.`);
    }

    return 'black';
  }

  getLayerIndex(layer: string): number {
    if (layer) {
      layer = layer.replace('#','');
      const layerNumber = this.orderedLayers.indexOf(layer);
      if (layerNumber == -1) {
        this.errorService.logWarning(`Change layer ${layer} not found in listChange element.`);
        return 0;
      }
      return layerNumber;
    }

    return 0;
  }

  layerHidden(subEl: GenericElement): boolean {
    if (this.editionLevel !== 'changesView') {
      return false;
    }
    this.evtStatusService.currentChanges$.subscribe(({ next: (data) => this.setLayerData(data) }));
    if ((this.selectedLayer !== undefined) && (this.data.changeLayer !== undefined)) {
      // we are always showing deletions regardless of mod change layer
      if (!this.data.insideApp[0] && subEl.class === 'del') {
        return false;
      }
      // generic content managament
      if (this.getLayerIndex(this.selectedLayer) < this.getLayerIndex(this.data.changeLayer)) {
        return true;
      }
    }

    return false;
  }

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  constructor(
    public evtStatusService: EVTStatusService,
    private errorService: ErrorsService,
  ) {}


}
