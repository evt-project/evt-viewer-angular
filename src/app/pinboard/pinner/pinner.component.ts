import { Attribute, Component, Input } from '@angular/core';
import { EVTBtnClickEvent } from '../../ui-components/button/button.component';
import { PinboardService } from '../pinboard.service';

@Component({
  selector: 'evt-pinner',
  templateUrl: './pinner.component.html',
  styleUrls: ['./pinner.component.scss'],
})
export class PinnerComponent {
  @Input() item;
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
