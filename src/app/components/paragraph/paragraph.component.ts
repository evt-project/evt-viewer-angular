import { Component, Input } from '@angular/core';

import { Paragraph } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { Base, Highlightable } from '../components-mixins';

@Component({
  selector: 'evt-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.scss'],
})

@register(Paragraph)
export class ParagraphComponent extends Highlightable(Base) {
  @Input() data: Paragraph;
}
