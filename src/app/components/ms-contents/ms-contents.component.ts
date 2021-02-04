import { Component, Input } from '@angular/core';
import { MsContents } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-ms-contents',
  templateUrl: './ms-contents.component.html',
  styleUrls: ['./ms-contents.component.scss'],
})

@register(MsContents)
export class MsContentsComponent {
  @Input() data: MsContents;
}
