import { Component, Input } from '@angular/core';
import { GenericElement } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EditionlevelSusceptible, Highlightable, ShowDeletionsSusceptible, TextFlowSusceptible } from '../components-mixins';

export interface GenericElementComponent extends EditionlevelSusceptible, Highlightable, TextFlowSusceptible, ShowDeletionsSusceptible { }

@Component({
  selector: 'evt-generic-element',
  templateUrl: './generic-element.component.html',
  styleUrls: ['./generic-element.component.scss'],
})
@register(GenericElement)
export class GenericElementComponent {
  @Input() data: GenericElement;
  @Input() selectedLayer: string;
}
