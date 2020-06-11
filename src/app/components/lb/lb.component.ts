import { Component, Input } from '@angular/core';

import { Lb } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@register(Lb)
@Component({
  selector: 'evt-lb',
  templateUrl: './lb.component.html',
  styleUrls: ['./lb.component.scss'],
})
export class LbComponent {
  @Input() data: Lb;
}
