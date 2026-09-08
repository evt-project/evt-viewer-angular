import { Component, Input } from '@angular/core';
import { Additional } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EvtDynamicComponent } from '../components-mixins';

@Component({
  selector: 'evt-additional',
  templateUrl: './additional.component.html',
  styleUrls: ['./additional.component.scss'],
})

@register(Additional)
export class AdditionalComponent extends EvtDynamicComponent {
  @Input() data: Additional;

}
