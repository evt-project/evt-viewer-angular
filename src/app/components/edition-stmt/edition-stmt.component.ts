import { Component, Input } from '@angular/core';

import { EditionStmt } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-edition-stmt',
  templateUrl: './edition-stmt.component.html',
  styleUrls: ['./edition-stmt.component.scss'],
})
@register(EditionStmt)
export class EditionStmtComponent {
  @Input() data: EditionStmt;
}
