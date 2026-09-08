import { Component, Input } from '@angular/core';
import { PhysDesc } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EvtDynamicComponent } from '../components-mixins';

@Component({
  selector: 'evt-phys-desc',
  templateUrl: './phys-desc.component.html',
  styleUrls: ['./phys-desc.component.scss'],
})

@register(PhysDesc)
export class PhysDescComponent extends EvtDynamicComponent {
  @Input() data: PhysDesc;
}
