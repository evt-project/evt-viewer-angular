import { Component, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { EVTModelService } from '../../services/evt-model.service';

import { Verse } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EditionlevelSusceptible, Highlightable } from '../components-mixins';

export interface VerseComponent extends EditionlevelSusceptible, Highlightable { }

@Component({
  selector: 'evt-verse',
  templateUrl: './verse.component.html',
  styleUrls: ['./verse.component.scss'],
})

@register(Verse)
export class VerseComponent {
  @Input() data: Verse;

  get displayBlock$() {
    return this.evtModelService.lines$.pipe(
      map(lines => lines.length > 0),
      map(hasLines => {
        // In diplomatic and interpretative edition, if the text doesn't have any line, verses are shown as block items
        // In critical edition verses are always shown as block items
        switch (this.editionLevel) {
          case 'diplomatic':
          case 'interpretative':
            return !hasLines;
          case 'critical':
            return true;
        }
      }),
    );
  }

  constructor(
    private evtModelService: EVTModelService,
  ) {
  }
}
