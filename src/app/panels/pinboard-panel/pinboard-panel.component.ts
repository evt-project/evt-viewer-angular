import { Component, EventEmitter, Output } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { PinboardService } from '../../pinboard/pinboard.service';

@Component({
  selector: 'evt-pinboard-panel',
  templateUrl: './pinboard-panel.component.html',
  styleUrls: ['./pinboard-panel.component.scss'],
})
export class PinboardPanelComponent {
  @Output() hide: EventEmitter<void> = new EventEmitter();

  public selectedPinTypes: string[] = [];
  public pinboardTypes$ = this.pinboard.getItems().pipe(
    map(items => {
      const types = [];
      items.forEach(item => {
        const pinType = item.pinType;
        if (pinType && !types.find(i => i.id === item.pinType)) {
          types.push({ id: pinType, label: pinType });
        }
      });

      return types;
    }),
    tap(types => {
      if (this.selectedPinTypes && this.selectedPinTypes.length > 0) {
        this.selectedPinTypes = [...this.selectedPinTypes.filter(type => types.find(i => i.id === type))];
      }
    }));

  constructor(private pinboard: PinboardService) { }

  emitHide() {
    this.hide.emit();
  }
}
