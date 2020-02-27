import { Component, Input } from '@angular/core';
import { EntitiesSelectItem } from '../components/entities-select/entities-select.component';

@Component({
  selector: 'evt-highlightable',
  template: '',
})
export class HighlightableComponent {
  @Input() highlightData: { highlight: boolean, highlightColor: string };
  @Input() itemsToHighlight: EntitiesSelectItem[];
}
