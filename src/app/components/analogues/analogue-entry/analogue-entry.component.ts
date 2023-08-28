import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { scan, startWith } from 'rxjs/operators';

import { EditorialConventionLayoutData } from '../../../directives/editorial-convention-layout.directive';

import { AnalogueClass, ParallelPassage } from '../../../models/evt-models';
import { register } from '../../../services/component-register.service';
import { EVTStatusService } from '../../../services/evt-status.service';
import { EditionLevelType } from 'src/app/app.config';

export interface AnalogueEntryComponent { }
@register(ParallelPassage)
@Component({
  selector: 'evt-analogue-entry',
  templateUrl: './analogue-entry.component.html',
  styleUrls: ['./analogue-entry.component.scss','../../sources/sources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalogueEntryComponent {
  @Input() data: ParallelPassage;

  private edLevel: EditionLevelType;
  @Input() set editionLevel(el: EditionLevelType) {
    this.edLevel = el;
    this.editionLevelChange.next(el);
  }
  get editionLevel() { return this.edLevel; }
  editionLevelChange = new BehaviorSubject<EditionLevelType | ''>('');

  get editorialConventionData(): EditorialConventionLayoutData {
    return {
      name: '.analogues',
      attributes: this.data?.attributes || {},
      editionLevel: this.editionLevel,
      defaultsKey: '.analogues',
    };
  }

  public analogueClass = AnalogueClass;

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
