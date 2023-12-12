import { Mod } from 'src/app/models/evt-models';
import { BehaviorSubject } from 'rxjs';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EditionLevelType } from 'src/app/app.config';

@Component({
  selector: 'evt-mod-detail',
  templateUrl: './mod-detail.component.html',
  styleUrls: ['./mod-detail.component.scss','../../sources/sources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModDetailComponent {

  private edLevel: EditionLevelType;
  public modEntry: Mod;
  public boxVisible: boolean;

  public ordLayers: string[];
  public selLayer: string;

  @Input() set orderedLayers(layers: string[]) {
    this.ordLayers = layers;
  }
  get orderedLayers() { return this.ordLayers; }

  @Input() set selectedLayer(layer: string) {
    this.selLayer = layer;
  }
  get selectedLayers() { return this.ordLayers; }

  @Input() set mod(el: Mod) {
    this.modEntry = el;
    this.isBoxVisible();
  }
  get mod() { return this.modEntry; }

  @Input() set editionLevel(el: EditionLevelType) {
    this.edLevel = el;
    this.editionLevelChange.next(el);
  }
  get editionLevel() { return this.edLevel; }
  editionLevelChange = new BehaviorSubject<EditionLevelType | ''>('');

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  isBoxVisible() {
    this.boxVisible = !(this.modEntry?.insideApp[0]);
  }


}

