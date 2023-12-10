import { Component, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { EVTModelService } from '../../services/evt-model.service';

import { AppConfig } from '../../app.config';
import { Verse } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EditionlevelSusceptible, Highlightable, ShowDeletionsSusceptible, TextFlowSusceptible } from '../components-mixins';

export interface VerseComponent extends EditionlevelSusceptible, Highlightable, TextFlowSusceptible, ShowDeletionsSusceptible { }

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
      map((lines) => lines.length > 0),
      map((hasLines) => {
        // In diplomatic and interpretative edition, if the text doesn't have any line, verses are shown as block items,
        // unless current text flow is prose
        // In critical edition verses are always shown as block items, unless current text flow is prose
        switch (this.editionLevel) {
          case 'diplomatic':
          case 'interpretative':
            return this.textFlow === 'verses' || !hasLines;
          case 'critical':
            return this.textFlow !== 'prose';
        }
      }),
    );
  }

  private verseNumberPrinter = AppConfig.evtSettings.edition.verseNumberPrinter || 5;
  get showNumber() {
    const num = parseInt(this.data.n, 10);

    return !isNaN(num) && num % this.verseNumberPrinter !== 0;
  }

  constructor(
    private evtModelService: EVTModelService,
  ) {
  }
}
