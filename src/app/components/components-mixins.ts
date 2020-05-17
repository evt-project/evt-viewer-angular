import { Input } from '@angular/core';
import { EditionLevelType } from '../app.config';
import { EntitiesSelectItem } from './entities-select/entities-select.component';

export class Highlightable {
  @Input() highlightData: { highlight: boolean, highlightColor: string };
  @Input() itemsToHighlight: EntitiesSelectItem[];
}

export class EditionlevelSusceptible {
  @Input() editionLevel: EditionLevelType;
}
