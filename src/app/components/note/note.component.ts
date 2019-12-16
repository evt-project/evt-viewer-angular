import { Component, Input, ViewChild } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { NoteData } from '../../models/parsed-elements';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
@register
export class NoteComponent {
  @Input() data: NoteData;
  @ViewChild('popover', { static: true }) popover: NgbPopover;

  public pinnerStyle = {
    'margin-right': '-0.65rem',
    'margin-top': '-0.35rem',
    float: 'right',
  };

  onTriggerClicked(event: MouseEvent) {
    event.stopPropagation();
  }
}
