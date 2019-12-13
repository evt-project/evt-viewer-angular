import { Component, EventEmitter, Input, Output } from '@angular/core';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-witness-panel',
  templateUrl: './witness-panel.component.html',
  styleUrls: ['./witness-panel.component.scss'],
})
@register
export class WitnessPanelComponent {
  @Input() witness: string;
  @Output() hide = new EventEmitter<boolean>();

  emitHide() {
    this.hide.emit(true);
  }

}
