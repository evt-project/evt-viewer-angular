import { Component, Input } from '@angular/core';

import { GenericElement, Lb, Word } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EditionlevelSusceptible, Highlightable } from '../components-mixins';

export interface WordComponent extends EditionlevelSusceptible, Highlightable { }

@Component({
  selector: 'evt-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
})
@register(Word)
export class WordComponent {
  @Input() data: Word;

  get word() {
    if (this.editionLevel === 'diplomatic') {
      return this.data.content;
    }

    const lbIndex = this.data.content.findIndex((el: GenericElement) => el.type === Lb);
    if (lbIndex >= 0) {
      const wordContent = [...this.data.content];
      wordContent.splice(lbIndex, 1);
      wordContent.push(this.data.content[lbIndex]);

      return wordContent;
    }

    return this.data.content;
  }
}
