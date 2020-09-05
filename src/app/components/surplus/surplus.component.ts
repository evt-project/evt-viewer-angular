import { Component, Input } from '@angular/core';
import { EditorialConventionLayoutData } from '../../directives/editorial-convention-layout.directive';
import { Surplus } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EditionlevelSusceptible, Highlightable } from '../components-mixins';

export interface SurplusComponent extends EditionlevelSusceptible, Highlightable { }

@Component({
  selector: 'evt-surplus',
  templateUrl: './surplus.component.html',
  styleUrls: ['./surplus.component.scss'],
})
@register(Surplus)
export class SurplusComponent {
  @Input() data: Surplus;

  get editorialConventionData(): EditorialConventionLayoutData {
    return {
      name: 'surplus',
      attributes: this.data?.attributes || {},
      editionLevel: this.editionLevel,
      defaultsKey: 'surplus',
    };
  }
}
