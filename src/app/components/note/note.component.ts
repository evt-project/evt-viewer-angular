import { Component, Input, ViewChild } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Note } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EditionLevelType } from 'src/app/app.config';

@Component({
  selector: 'evt-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
@register(Note)
export class NoteComponent {
  @Input() data: Note;
  @Input() editionLevel: EditionLevelType;
  @Input() withDeletions: boolean;
  @Input() selectedLayer: string;
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
