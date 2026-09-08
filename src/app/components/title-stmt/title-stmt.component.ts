import { Component, Input } from '@angular/core';

import { TitleStmt } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EvtDynamicComponent } from '../components-mixins';

@Component({
  selector: 'evt-title-stmt',
  templateUrl: './title-stmt.component.html',
  styleUrls: ['./title-stmt.component.scss'],
})
@register(TitleStmt)
export class TitleStmtComponent extends EvtDynamicComponent {
  @Input() data: TitleStmt;
}
