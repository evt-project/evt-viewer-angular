import { Component, Input } from '@angular/core';
import { EditionLevelSusceptibleComponent } from '../components/edition-level-susceptible/edition-level-susceptible.component';
import { EntitiesSelectItem } from '../components/entities-select/entities-select.component';

@Component({
  selector: 'evt-highlightable',
  template: '',
})
export class HighlightableComponent extends EditionLevelSusceptibleComponent {
  @Input() highlightData: { highlight: boolean, highlightColor: string };
  @Input() itemsToHighlight: EntitiesSelectItem[];
}
