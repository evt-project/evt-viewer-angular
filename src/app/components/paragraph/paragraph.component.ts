import { Component, Input } from '@angular/core';
import { HighlightableComponent } from '../../highlightable/highlightable.component';
import { ParagraphData } from '../../models/parsed-elements';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.scss'],
})

@register
export class ParagraphComponent extends HighlightableComponent {
  @Input() data: ParagraphData;
}
