import { Directive, Input } from '@angular/core';
import { EditionLevelType, TextFlow } from '../app.config';
import { HighlightData } from '../models/evt-models';
import { EntitiesSelectItem } from './entities-select/entities-select.component';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export class EvtDynamicComponent {
  @Input() highlightData: HighlightData;
  @Input() itemsToHighlight: EntitiesSelectItem[];
  @Input() textFlow: TextFlow;
  @Input() withDeletions: boolean;
  @Input() selectedLayer: string;

  protected edLevel: EditionLevelType;

  @Input() set editionLevel(el: EditionLevelType) { this.edLevel = el; }
  get editionLevel(): EditionLevelType { return this.edLevel; }
}
