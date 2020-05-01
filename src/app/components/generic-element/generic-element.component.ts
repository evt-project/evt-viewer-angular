import { Component, Input } from '@angular/core';
import { GenericElement } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { Base, EditionlevelSusceptible, Highlightable } from '../components-mixins';

@Component({
  selector: 'evt-generic-element',
  templateUrl: './generic-element.component.html',
  styleUrls: ['./generic-element.component.scss'],
})
@register(GenericElement)
export class GenericElementComponent extends EditionlevelSusceptible(Highlightable(Base)) {
  @Input() data: GenericElement;
}
