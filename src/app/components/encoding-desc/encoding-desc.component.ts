import { Component, Input } from '@angular/core';
import { EncodingDesc } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EvtDynamicComponent } from '../components-mixins';

@Component({
  selector: 'evt-encoding-desc',
  templateUrl: './encoding-desc.component.html',
  styleUrls: ['./encoding-desc.component.scss'],
})
@register(EncodingDesc)
export class EncodingDescComponent extends EvtDynamicComponent {
  @Input() data: EncodingDesc;
}
