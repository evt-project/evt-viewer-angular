import { Component, Input } from '@angular/core';

import { LbData } from '../../models/parsed-elements';
import { register } from '../../services/component-register.service';

@register(LbData)
@Component({
  selector: 'evt-lb',
  templateUrl: './lb.component.html',
  styleUrls: ['./lb.component.scss'],
})
export class LbComponent {
  @Input() data: LbData;
}
