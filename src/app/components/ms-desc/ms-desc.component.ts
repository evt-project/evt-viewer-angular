import { Component, Input } from '@angular/core';
import { MsDesc } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EvtDynamicComponent } from '../components-mixins';

@Component({
  selector: 'evt-ms-desc',
  templateUrl: './ms-desc.component.html',
  styleUrls: ['./ms-desc.component.scss'],
})

@register(MsDesc)
export class MsDescComponent extends EvtDynamicComponent {
  @Input() data: MsDesc;
}
