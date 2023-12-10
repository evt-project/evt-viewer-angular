import { Directive, Input } from '@angular/core';
import { EditionLevelType, TextFlow } from '../app.config';
import { HighlightData } from '../models/evt-models';
import { EntitiesSelectItem } from './entities-select/entities-select.component';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export class Highlightable {
  @Input() highlightData: HighlightData;
  @Input() itemsToHighlight: EntitiesSelectItem[];
}

@Directive()
// tslint:disable-next-line: directive-class-suffix
export class EditionlevelSusceptible {
  @Input() editionLevel: EditionLevelType;
}

@Directive()
// tslint:disable-next-line: directive-class-suffix
export class TextFlowSusceptible {
  @Input() textFlow: TextFlow;
}

@Directive()
// tslint:disable-next-line: directive-class-suffix
export class ShowDeletionsSusceptible {
  @Input() withDeletions: boolean;
}
