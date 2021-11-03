import { Component, Input } from '@angular/core';
import { PublicationStmt } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-publication-stmt',
  templateUrl: './publication-stmt.component.html',
  styleUrls: ['./publication-stmt.component.scss'],
})
@register(PublicationStmt)
export class PublicationStmtComponent {
  @Input() data: PublicationStmt;

}
