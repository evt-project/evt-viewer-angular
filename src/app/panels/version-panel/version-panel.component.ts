import { Component, EventEmitter, Input, Output } from '@angular/core';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-version-panel',
  templateUrl: './version-panel.component.html',
  styleUrls: ['./version-panel.component.scss'],
})
@register
export class VersionPanelComponent {
  @Input() version: string;
  @Output() hide = new EventEmitter<boolean>();

  emitHide() {
    this.hide.emit(true);
  }

}
