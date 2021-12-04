import { Component, Input } from '@angular/core';
import { NotesStmt } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-notes-stmt',
  templateUrl: './notes-stmt.component.html',
  styleUrls: ['./notes-stmt.component.scss'],
})
@register(NotesStmt)
export class NotesStmtComponent {
  @Input() data: NotesStmt;

}
