import { Component, Input } from '@angular/core';
import { PublicationStmt } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EvtDynamicComponent } from '../components-mixins';

@Component({
  selector: 'evt-publication-stmt',
  templateUrl: './publication-stmt.component.html',
  styleUrls: ['./publication-stmt.component.scss'],
})
@register(PublicationStmt)
export class PublicationStmtComponent extends EvtDynamicComponent {
  @Input() data: PublicationStmt;

}
