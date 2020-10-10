import { Component, Input } from '@angular/core';

import { EditorialConventionLayoutData } from '../../directives/editorial-convention-layout.directive';
import { Damage } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EditionlevelSusceptible, Highlightable } from '../components-mixins';

export interface DamageComponent extends EditionlevelSusceptible, Highlightable { }

@Component({
  selector: 'evt-damage',
  templateUrl: './damage.component.html',
  styleUrls: ['./damage.component.scss'],
})
@register(Damage)
export class DamageComponent {
  @Input() data: Damage;

  get editorialConventionData(): EditorialConventionLayoutData {
    return {
      name: 'damage',
      attributes: this.data?.attributes || {},
      editionLevel: this.editionLevel,
      defaultsKey: 'damage',
    };
  }
}
