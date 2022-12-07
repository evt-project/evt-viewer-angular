import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { getEventKeyCode } from '../../utils/js-utils';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[escape]',
})
export class EscapeDirective {
  @Output() escape = new EventEmitter<void>();

  @HostListener('window:keyup', ['$event'])
  keyEvent(e: KeyboardEvent) {
    if (e.code === 'Escape' || e.key === 'Escape' || getEventKeyCode(e) === 27) {
      this.escape.emit();
    }
  }
}
