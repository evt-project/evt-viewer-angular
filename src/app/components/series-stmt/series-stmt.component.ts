import { Component, Input } from '@angular/core';
import { SeriesStmt } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-series-stmt',
  templateUrl: './series-stmt.component.html',
  styleUrls: ['./series-stmt.component.scss'],
})
@register(SeriesStmt)
export class SeriesStmtComponent {
  @Input() data: SeriesStmt;
}
