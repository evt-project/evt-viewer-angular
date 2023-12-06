import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Mod } from 'src/app/models/evt-models';

@Component({
  selector: 'evt-mod-sequence',
  templateUrl: './mod-sequence.component.html',
  styleUrls: ['./mod-sequence.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModSequenceComponent {

  public sequence: Mod[];

  public ordLayers: string[];
  public selLayer: string;

  public showSeqAttr = false;
  public showVarSeqAttr = false;
  public colors = [];

  @Input() set orderedLayers(layers: string[]) {
    this.ordLayers = layers;
  }
  get orderedLayers() { return this.ordLayers; }

  @Input() set selectedLayer(layer: string) {
    this.selLayer = layer;
  }
  get selectedLayer() { return this.selLayer; }

  @Input() set data(el: Mod[]) {
    this.sequence = Array.from(el);
  }

  get data() { return this.sequence; }

}

