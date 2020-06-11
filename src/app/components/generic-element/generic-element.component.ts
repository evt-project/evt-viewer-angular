import { Component, Input } from '@angular/core';
import { HighlightableComponent } from '../../highlightable/highlightable.component';
import { GenericElement } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-generic-element',
  templateUrl: './generic-element.component.html',
  styleUrls: ['./generic-element.component.scss'],
})
@register(GenericElement)
export class GenericElementComponent extends HighlightableComponent {
  @Input() data: GenericElement;
}
