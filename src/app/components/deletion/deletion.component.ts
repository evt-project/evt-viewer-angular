import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EditorialConventionLayoutData } from '../../directives/editorial-convention-layout.directive';
import { Deletion } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EditionlevelSusceptible, Highlightable, ShowDeletionsSusceptible } from '../components-mixins';

export interface DeletionComponent extends EditionlevelSusceptible, Highlightable, ShowDeletionsSusceptible { }

@register(Deletion)
@Component({
  selector: 'evt-deletion',
  templateUrl: './deletion.component.html',
  styleUrls: ['./deletion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeletionComponent {
  @Input() data: Deletion;

  get editorialConventionData(): EditorialConventionLayoutData {
    return {
      name: 'del',
      attributes: this.data.attributes,
      editionLevel: this.editionLevel,
      defaultsKey: 'deletion',
    };
  }
}
