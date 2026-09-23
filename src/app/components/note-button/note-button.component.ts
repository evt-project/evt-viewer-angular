import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'evt-note-button',
  templateUrl: './note-button.component.html',
  styleUrls: ['./note-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteButtonComponent {
  @Input() exponent: string;
  @Input() noteType: string;
  @Input() isHovering: boolean = false;

  constructor() { }
}