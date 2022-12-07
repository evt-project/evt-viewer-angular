import { Component, Input } from '@angular/core';
import { MsIdentifier } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-ms-identifier',
  templateUrl: './ms-identifier.component.html',
  styleUrls: ['./ms-identifier.component.scss'],
})

@register(MsIdentifier)
export class MsIdentifierComponent {
  @Input() data: MsIdentifier;
}
