import { Component, Input } from '@angular/core';

import { Word } from '../../models/evt-models';
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
}
