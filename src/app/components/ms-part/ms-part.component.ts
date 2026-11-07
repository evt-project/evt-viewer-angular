import { Component, Input } from '@angular/core';
import { MsPart } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EvtDynamicComponent } from '../components-mixins';

@Component({
  selector: 'evt-ms-part',
  templateUrl: './ms-part.component.html',
  styleUrls: ['./ms-part.component.scss'],
})

@register(MsPart)
export class MsPartComponent extends EvtDynamicComponent {
  @Input() data: MsPart;
}
