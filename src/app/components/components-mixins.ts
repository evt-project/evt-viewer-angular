import { Directive, Input } from '@angular/core';
import { EditionLevelType, TextFlow } from '../app.config';
import { HighlightData } from '../models/evt-models';
import { EntitiesSelectItem } from './entities-select/entities-select.component';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class Highlightable {
  @Input() highlightData: HighlightData;
  @Input() itemsToHighlight: EntitiesSelectItem[];
}

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class EditionlevelSusceptible {
  @Input() editionLevel: EditionLevelType;
}

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class TextFlowSusceptible {
  @Input() textFlow: TextFlow;
}
