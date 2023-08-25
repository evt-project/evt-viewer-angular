import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { scan, startWith } from 'rxjs/operators';

import { EditorialConventionLayoutData } from '../../directives/editorial-convention-layout.directive';

import { QuoteEntry } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EVTStatusService } from '../../services/evt-status.service';
import { EditionLevelType } from 'src/app/app.config';
import { EditionlevelSusceptible, Highlightable } from '../components-mixins';

export interface QuoteEntryComponent extends EditionlevelSusceptible, Highlightable { } { }
@register(QuoteEntry)
@Component({
  selector: 'evt-quote-entry',
  templateUrl: './quote-entry.component.html',
  styleUrls: ['./quote-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteEntryComponent {
  @Input() data: QuoteEntry;

  private edLevel: EditionLevelType;
  @Input() set editionLevel(el: EditionLevelType) {
    this.edLevel = el;
    this.editionLevelChange.next(el);
  }
  get editionLevel() { return this.edLevel; }
  editionLevelChange = new BehaviorSubject<EditionLevelType | ''>('');

  get editorialConventionData(): EditorialConventionLayoutData {
    return {
      name: '.sources',
      attributes: this.data?.attributes || {},
      editionLevel: this.editionLevel,
      defaultsKey: '.sources',
    };
  }

  public opened = false;

  toggleOpened$ = new Subject<boolean | void>();

  opened$ = this.toggleOpened$.pipe(
    scan((currentState: boolean, val: boolean | undefined) => val === undefined ? !currentState : val, false),
    startWith(false),
  );

  toggleAppEntryBox(e: MouseEvent) {
    e.stopPropagation();
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
  ) {}

}
