import { Input } from '@angular/core';
import { EditionLevelType, TextFlow } from '../app.config';
import { HighlightData } from '../models/evt-models';
import { EntitiesSelectItem } from './entities-select/entities-select.component';

export class Highlightable {
  @Input() highlightData: HighlightData;
  @Input() itemsToHighlight: EntitiesSelectItem[];
}

export class EditionlevelSusceptible {
  @Input() editionLevel: EditionLevelType;
}

export class TextFlowSusceptible {
  @Input() textFlow: TextFlow;
}
