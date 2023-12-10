import { Component, Input } from '@angular/core';

import { EditorialConventionLayoutData } from '../../directives/editorial-convention-layout.directive';
import { Addition } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EditorialConventionDefaults } from '../../services/editorial-conventions.service';
import { EditionlevelSusceptible, Highlightable, ShowDeletionsSusceptible } from '../components-mixins';

export interface AdditionComponent extends EditionlevelSusceptible, Highlightable, ShowDeletionsSusceptible { }

@register(Addition)
@Component({
  selector: 'evt-addition',
  templateUrl: './addition.component.html',
  styleUrls: ['./addition.component.scss'],
})
export class AdditionComponent {
  @Input() data: Addition;

  get editorialConventionData(): EditorialConventionLayoutData {
    return {
      name: 'add',
      attributes: this.data.attributes,
      editionLevel: this.editionLevel,
      defaultsKey: this._getDefaultLayoutsKeys(),
    };
  }

  private _getDefaultLayoutsKeys(): EditorialConventionDefaults {
    switch (this.data.place) {
      case 'above':
      case 'sup':
      case 'superscript':
        return 'additionAbove';
      case 'below':
      case 'under':
      case 'sub':
        return 'additionBelow';
      case 'end':
      case 'inline':
      case 'inspace':
        return 'additionInline';
      case 'left':
        return 'additionLeft';
      case 'right':
        return 'additionRight';
      default:
        return 'addition';
    }
  }
}
