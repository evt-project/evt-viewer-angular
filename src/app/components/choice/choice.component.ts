import { Component, Input } from '@angular/core';

import { EditionLevelType } from '../../app.config';
import { Choice } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EditionlevelSusceptible, Highlightable, ShowDeletionsSusceptible, TextFlowSusceptible } from '../components-mixins';

export interface ChoiceComponent extends EditionlevelSusceptible, Highlightable, TextFlowSusceptible, ShowDeletionsSusceptible { }

@Component({
  selector: 'evt-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.scss'],
})
@register(Choice)
export class ChoiceComponent {
  @Input() data: Choice;

  get content() {
    if ((this.editionLevel === 'diplomatic') || (this.editionLevel === 'changesView')) {
      return this.data.originalContent;
    }

    return this.data.normalizedContent;
  }

  get alternativeContent() {
    if ((this.editionLevel === 'diplomatic') || (this.editionLevel === 'changesView')) {
      return this.data.normalizedContent;
    }

    return this.data.originalContent;
  }

  get alternativeEditionLevel(): EditionLevelType {
    return this.editionLevel === 'diplomatic' ? 'interpretative' : 'diplomatic';
  }
}
