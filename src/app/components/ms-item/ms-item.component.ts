import { Component, Input } from '@angular/core';
import { MsItem } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-ms-item',
  templateUrl: './ms-item.component.html',
  styleUrls: ['./ms-item.component.scss'],
})

@register(MsItem)
export class MsItemComponent {
  @Input() data: MsItem;
  @Input() nested1: boolean;
  @Input() nested2: boolean;
}
