import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { scan, startWith } from 'rxjs/operators';

import { EditorialConventionLayoutData } from '../../../directives/editorial-convention-layout.directive';

import { Analogue, AnalogueClass, Note } from '../../../models/evt-models';
import { register } from '../../../services/component-register.service';
import { EVTStatusService } from '../../../services/evt-status.service';
import { EditionLevelType } from 'src/app/app.config';

export interface AnalogueEntryComponent {}
@register(Analogue)
@Component({
  selector: 'evt-analogue-entry',
  templateUrl: './analogue-entry.component.html',
  styleUrls: ['./analogue-entry.component.scss','../../sources/sources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalogueEntryComponent implements OnInit {

  public _data: Analogue;
  private edLevel: EditionLevelType;

  @Input() set data(dt: Analogue) {
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
      name: 'analogues',
      attributes: this.data?.attributes || {},
      editionLevel: this.editionLevel,
      defaultsKey: 'analogues',
    };
  }

  get data() { return this._data; }

  public analogueClass = AnalogueClass;
  public dataForNote = {};
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

  /** If the element has no text then it's displayed as a note.*/
  createNote(v): Note|{} {
    return {
      type: Note,
      noteType: 'analogue',
      noteLayout: 'popover',
      exponent: v.path || '',
      content: v.extLinkedElements.concat(v.extSources, v.sources) || {},
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
    if (this.data.text.length === 0) {
      this.dataForNote = this.createNote(this.data);
    }
  }

}
