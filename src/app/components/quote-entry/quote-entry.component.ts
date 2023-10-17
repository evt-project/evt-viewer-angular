import { Component, Input } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { map, scan, startWith } from 'rxjs/operators';

import { EditorialConventionDefaults } from 'src/app/services/editorial-conventions.service';
import { EditorialConventionLayoutData } from '../../directives/editorial-convention-layout.directive';

import { QuoteEntry } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EVTStatusService } from '../../services/evt-status.service';
import { EditionlevelSusceptible, Highlightable, TextFlowSusceptible } from '../components-mixins';

export interface QuoteEntryComponent extends EditionlevelSusceptible, Highlightable, TextFlowSusceptible { }

@Component({
  selector: 'evt-quote-entry',
  templateUrl: './quote-entry.component.html',
  styleUrls: ['./quote-entry.component.scss'],
})
@register(QuoteEntry)
export class QuoteEntryComponent {

  @Input() data: QuoteEntry;

  public opened = false;

  toggleOpened$ = new Subject<boolean | void>();
  opened$ = this.toggleOpened$.pipe(
    scan((currentState: boolean, val: boolean | undefined) => val === undefined ? !currentState : val, false),
    startWith(false),
  );

  quoteHighlight$ = combineLatest([
    this.opened$,
    this.evtStatusService.currentQuotedId$,
  ]).pipe(
    map(([opened, currentId]) => currentId === this.data.id && !opened),
  );

  get editorialConventionData(): EditorialConventionLayoutData {
    return {
      name: 'quotation',
      attributes: this.data?.attributes || {},
      editionLevel: this.editionLevel,
      defaultsKey: this.defaultsKey,
    };
  }

  get defaultsKey(): EditorialConventionDefaults {
    return 'quotation';
  }

  toggleAppEntryBox(e: MouseEvent) {
    e.stopPropagation();
    console.log('ho aperto');
    this.opened = !this.opened;
  }

  closeAppEntryBox() {
    this.opened = false;
  }

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  constructor(
    public evtStatusService: EVTStatusService,
  ) {
  }

}
