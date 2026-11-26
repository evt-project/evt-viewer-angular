import { Component, Input } from '@angular/core';
import { MsIdentifier } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EvtDynamicComponent } from '../components-mixins';

@Component({
  selector: 'evt-ms-identifier',
  templateUrl: './ms-identifier.component.html',
  styleUrls: ['./ms-identifier.component.scss'],
})

@register(MsIdentifier)
export class MsIdentifierComponent extends EvtDynamicComponent {
  @Input() data: MsIdentifier;
}
