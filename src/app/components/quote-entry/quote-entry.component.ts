import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { scan, startWith } from 'rxjs/operators';

import { EditorialConventionLayoutData } from '../../directives/editorial-convention-layout.directive';

import { Note, QuoteEntry, SourceClass } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EVTStatusService } from '../../services/evt-status.service';
import { EditionLevelType } from 'src/app/app.config';
import { EditionlevelSusceptible, Highlightable } from '../components-mixins';

export interface QuoteEntryComponent extends EditionlevelSusceptible, Highlightable {}
@register(QuoteEntry)
@Component({
  selector: 'evt-quote-entry',
  templateUrl: './quote-entry.component.html',
  styleUrls: ['./quote-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteEntryComponent implements OnInit {
  public _data: QuoteEntry;
  private edLevel: EditionLevelType;
  public sourceClass = SourceClass;
  public dataForNote = {};
  public opened = false;

  @Input() set data(dt: QuoteEntry) {
    this._data = dt;
  }

  @Input() set editionLevel(el: EditionLevelType) {
    this.edLevel = el;
    this.editionLevelChange.next(el);
  }

  get editionLevel() { return this.edLevel; }
  editionLevelChange = new BehaviorSubject<EditionLevelType | ''>('');

  get editorialConventionData(): EditorialConventionLayoutData {
    return {
      name: 'sources',
      attributes: this.data?.attributes || {},
      editionLevel: this.editionLevel,
      defaultsKey: 'sources',
    };
  }

  get data() { return this._data; }

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

   /** If quote has no text it's displayed as a note.*/
  createNote(v): Note|{} {
    return {
      type: Note,
      noteType: 'source',
      noteLayout: 'popover',
      exponent: v.path || '',
      content: v.extSources.concat(v.extElements),
      attributes: v.attributes || [],
    }
  }

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  constructor(
    public evtStatusService: EVTStatusService,
  ) {}

  ngOnInit() {
    if ((this.data.isNoteView) || ((this.data.text.length === 0) && ((this.data.extElements.length !== 0) || (this.data.extSources.length !== 0)))) {
      this.dataForNote = this.createNote(this.data);
    }
  }

}
