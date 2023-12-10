import { Component, Input } from '@angular/core';
import { map } from 'rxjs/operators';

import { Lb } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EVTModelService } from '../../services/evt-model.service';
import { EditionlevelSusceptible, ShowDeletionsSusceptible, TextFlowSusceptible } from '../components-mixins';

export interface LbComponent extends EditionlevelSusceptible, TextFlowSusceptible, ShowDeletionsSusceptible { }

@register(Lb)
@Component({
  selector: 'evt-lb',
  templateUrl: './lb.component.html',
  styleUrls: ['./lb.component.scss'],
})
export class LbComponent {
  @Input() data: Lb;

  get displayBlock$() {
    return this.evtModelService.lines$.pipe(
      map((lines) => lines.length > 0),
      map((hasLines) => {
        // If line has no information about number or the ID line is shown as a block item, no matters what
        if (!this.data.attributes.id && !this.data.attributes.n) {
          return true;
        }
        // Otherwise:
        // - in diplomatic and interpretative edition, if the text has at least one line,
        // those are show as block items, unless current text flow is verses
        // - in critical editionm lines are always shown as inline items, unless current text flow is prose
        switch (this.editionLevel) {
          case 'diplomatic':
          case 'interpretative':
            return this.textFlow === 'verses' ? false : hasLines;
          case 'critical':
            return this.textFlow === 'prose';
        }
      }),
    );
  }

  get displayInline$() {
    return this.displayBlock$.pipe(
      map((displayBlock) => !displayBlock),
    );
  }

  constructor(
    private evtModelService: EVTModelService,
  ) {
  }
}
