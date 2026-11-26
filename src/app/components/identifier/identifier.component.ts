import { Component, Input } from '@angular/core';
import { Identifier } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EvtDynamicComponent } from '../components-mixins';

@Component({
  selector: 'evt-identifier',
  templateUrl: './identifier.component.html',
  styleUrls: ['./identifier.component.scss'],
})

@register(Identifier)
export class IdentifierComponent extends EvtDynamicComponent {
  @Input() data: Identifier;
  @Input() listClass: boolean;
}
