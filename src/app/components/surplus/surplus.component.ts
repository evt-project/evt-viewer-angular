import { Component, Input } from '@angular/core';
import { EditorialConventionLayoutData } from '../../directives/editorial-convention-layout.directive';
import { Surplus } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EvtDynamicComponent } from '../components-mixins';

@Component({
  selector: 'evt-surplus',
  templateUrl: './surplus.component.html',
  styleUrls: ['./surplus.component.scss'],
})
@register(Surplus)
export class SurplusComponent extends EvtDynamicComponent {
  @Input() data: Surplus;

  get editorialConventionData(): EditorialConventionLayoutData {
    return {
      name: 'surplus',
      attributes: this.data?.attributes || {},
      editionLevel: this.editionLevel,
    };
  }
}
