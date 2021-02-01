import { Component, Input } from '@angular/core';
import { PhysDescParser } from 'src/app/services/xml-parsers/msdesc-parser';
import { PhysDesc } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-phys-desc',
  templateUrl: './phys-desc.component.html',
  styleUrls: ['./phys-desc.component.scss'],
})

@register(PhysDescParser)
export class PhysDescComponent {
  @Input() data: PhysDesc;
}
