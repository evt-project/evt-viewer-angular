import { Component, Input } from '@angular/core';
import { Supplied } from 'src/app/models/evt-models';
import { register } from 'src/app/services/component-register.service';
import { EditionlevelSusceptible, Highlightable } from '../components-mixins';

export interface SuppliedComponent extends EditionlevelSusceptible, Highlightable { }

@Component({
  selector: 'evt-supplied',
  templateUrl: './supplied.component.html',
  styleUrls: ['./supplied.component.scss'],
})
@register(Supplied)
export class SuppliedComponent {
  @Input() data: Supplied;

}
