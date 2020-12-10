import { Input, Directive } from '@angular/core';
import { EditionLevelType, TextFlow } from '../app.config';
import { HighlightData } from '../models/evt-models';
import { EntitiesSelectItem } from './entities-select/entities-select.component';

@Directive()
export class Highlightable {
  @Input() highlightData: HighlightData;
  @Input() itemsToHighlight: EntitiesSelectItem[];
}

@Directive()
export class EditionlevelSusceptible {
  @Input() editionLevel: EditionLevelType;
}

@Directive()
export class TextFlowSusceptible {
  @Input() textFlow: TextFlow;
}
