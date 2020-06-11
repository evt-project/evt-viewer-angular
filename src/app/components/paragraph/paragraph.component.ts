import { Component, Input } from '@angular/core';
import { HighlightableComponent } from '../../highlightable/highlightable.component';
import { Paragraph } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.scss'],
})

@register(Paragraph)
export class ParagraphComponent extends HighlightableComponent {
  @Input() data: Paragraph;
}
