import { Component, Input } from '@angular/core';

import { Mod } from 'src/app/models/evt-models';
import { EditionlevelSusceptible, Highlightable, ShowDeletionsSusceptible, TextFlowSusceptible } from '../../components-mixins';
import { ChangeDetectionStrategy } from '@angular/core';
import { EditionLevelType } from 'src/app/app.config';
import { BehaviorSubject, distinctUntilChanged, map, scan, startWith, Subject } from 'rxjs';
import { EVTStatusService } from 'src/app/services/evt-status.service';

export interface ModGroupComponent extends EditionlevelSusceptible, Highlightable, TextFlowSusceptible, ShowDeletionsSusceptible { }

@Component({
  selector: 'evt-mod-group',
  templateUrl: './mod-group.component.html',
  styleUrls: ['../mod-detail/mod-detail.component.scss','../../sources/sources.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})

export class ModGroupComponent {

  public edLevel: EditionLevelType;
  public mods: Mod[];

  public orderedLayers: string[];
  public selLayer: string;

  public opened = false;

  public reverseLayersOrder = true;

  toggleOpened$ = new Subject<boolean | void>();
  opened$ = this.toggleOpened$.pipe(
    scan((currentState: boolean, val: boolean | undefined) => val === undefined ? !currentState : val, false),
    startWith(false),
  );

  public orderedLayers$ = this.evtStatusService.currentChanges$.pipe(
    distinctUntilChanged(),
    map(({ layerOrder }) => {
      this.orderedLayers = layerOrder;

      return layerOrder;
    } ),
  );

  @Input() set selectedLayer(layer: string) {
    this.selLayer = layer;
  }
  get selectedLayers() { return this.selLayer; }

  @Input() set modGroup(el: Mod[]) {
    this.mods = el;
  }
  get modGroup() { return this.mods; }

  @Input() set editionLevel(el: EditionLevelType) {
    this.edLevel = el;
    this.editionLevelChange.next(el);
  }
  get editionLevel() { return this.edLevel; }
  editionLevelChange = new BehaviorSubject<EditionLevelType | ''>('');

  @Input() containerElement;

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  getLayerIndex(layer): number {
    layer = layer.replace('#','');

    return this.orderedLayers.indexOf(layer);
  }

  constructor(
    public evtStatusService: EVTStatusService,
  ) {}

}
