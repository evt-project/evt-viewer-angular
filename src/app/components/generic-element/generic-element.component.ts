import { Component, Input } from '@angular/core';
import { HighlightableComponent } from '../../highlightable/highlightable.component';
import { GenericElementData } from '../../models/parsed-elements';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-generic-element',
  templateUrl: './generic-element.component.html',
  styleUrls: ['./generic-element.component.scss'],
})
@register(GenericElementData)
export class GenericElementComponent extends HighlightableComponent {
  @Input() data: GenericElementData;
}
