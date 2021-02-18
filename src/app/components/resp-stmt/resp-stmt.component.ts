import { Component, Input } from '@angular/core';
import { Resp, RespStmt } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-resp-stmt',
  templateUrl: './resp-stmt.component.html',
  styleUrls: ['./resp-stmt.component.scss'],
})
@register(RespStmt)
export class RespStmtComponent {
  @Input() data: RespStmt;

  openNormalizedResp(resp: Resp) {
    if (resp.normalizedResp) {
      window.open(resp.normalizedResp, '_blank');
    }
  }
}
