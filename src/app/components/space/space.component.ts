import { Component, Input } from '@angular/core';

import { EditionLevelType, TextFlow } from 'src/app/app.config';
import { HighlightData, Space } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EditionlevelSusceptible, Highlightable, TextFlowSusceptible } from '../components-mixins';
import { EntitiesSelectItem } from '../entities-select/entities-select.component';

export interface ISpaceComponent extends EditionlevelSusceptible, Highlightable, HighlightData, TextFlowSusceptible { }

@register(Space)
@Component({
  selector: 'evt-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss'],
})

export class SpaceComponent implements ISpaceComponent {
  @Input() textFlow: TextFlow;
  @Input() highlight: boolean;
  @Input() highlightColor: string;
  @Input() editionLevel: EditionLevelType;
  @Input() highlightData: HighlightData;
  @Input() itemsToHighlight: EntitiesSelectItem[];
  @Input() data: Space;

  get numSpaces() {
    return Array(parseInt( this.data.attributes.quantity)).keys();
  }
  constructor() {
    console.log('this is a space');
  }
}
