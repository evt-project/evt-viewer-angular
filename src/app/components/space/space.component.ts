import { Component, Input } from '@angular/core';

import { Space } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EvtDynamicComponent } from '../components-mixins';

@register(Space)
@Component({
  selector: 'evt-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss'],
})

export class SpaceComponent extends EvtDynamicComponent {
  @Input() highlight: boolean;
  @Input() highlightColor: string;
  @Input() data: Space;

  get numSpaces() {
    return Array(parseInt( this.data.attributes.quantity)).keys();
  }
}
