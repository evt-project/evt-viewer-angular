import { Component, Input } from '@angular/core';
import { MsContents } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EvtDynamicComponent } from '../components-mixins';

@Component({
  selector: 'evt-ms-contents',
  templateUrl: './ms-contents.component.html',
  styleUrls: ['./ms-contents.component.scss'],
})

@register(MsContents)
export class MsContentsComponent extends EvtDynamicComponent {
  @Input() data: MsContents;
}
