import { Component, Input, Attribute } from '@angular/core';
import { PinboardService } from '../pinboard.service';
import { EVTBtnClickEvent } from '../../ui-components/button/button.component';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-pinner',
  templateUrl: './pinner.component.html',
  styleUrls: ['./pinner.component.scss']
})
@register
export class PinnerComponent {
  @Input() item: any;
  @Input() additionalStyle: { [key: string]: string | number };
  constructor(
    @Attribute('pinType') public pinType: string,
    @Attribute('renderer') public renderer: string,
    private pinboard: PinboardService) { }

  isItemPinned() {
    return this.pinboard.isItemPinned(this.item);
  }

  togglePin(btnEvent: EVTBtnClickEvent) {
    btnEvent.event.stopPropagation();
    this.pinboard.toggleItem(this.item, { pinType: this.pinType, renderer: this.renderer });
  }
}
