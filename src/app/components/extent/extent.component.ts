import { Component, Input } from '@angular/core';

import { Extent } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EvtDynamicComponent } from '../components-mixins';

@Component({
  selector: 'evt-extent',
  templateUrl: './extent.component.html',
  styleUrls: ['./extent.component.scss'],
})
@register(Extent)
export class ExtentComponent extends EvtDynamicComponent {
  @Input() data: Extent;
}
