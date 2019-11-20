import { Directive, Output, EventEmitter, HostListener } from '@angular/core';
import { getEventKeyCode } from '../../utils/jsUtils';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[escape]'
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
