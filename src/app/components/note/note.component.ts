import { Component, Input, ViewChild } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { NoteData } from '../../models/parsed-elements';

@Component({
  selector: 'evt-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent {
  @Input() data: NoteData;
  @ViewChild('popover', { static: true }) popover: NgbPopover;

  public pinnerStyle = {
    'margin-right': '-0.65rem',
    'margin-top': '-0.35rem',
    float: 'right'
  };

  onTriggerClicked(event: MouseEvent) {
    event.stopPropagation();
  }
}
