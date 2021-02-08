import { Component, Input } from '@angular/core';
import { MsFrag } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-ms-frag',
  templateUrl: './ms-frag.component.html',
  styleUrls: ['./ms-frag.component.scss'],
})

@register(MsFrag)
export class MsFragComponent {
  @Input() data: MsFrag;
}
