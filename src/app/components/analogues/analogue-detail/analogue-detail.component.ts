import { Analogue } from 'src/app/models/evt-models';
import { BehaviorSubject } from 'rxjs';
import { Component, Input } from '@angular/core';
import { EditionLevelType } from 'src/app/app.config';

@Component({
  selector: 'evt-analogue-detail',
  templateUrl: './analogue-detail.component.html',
  styleUrls: ['./analogue-detail.component.scss','../../sources/sources.component.scss'],
})
export class AnalogueDetailComponent {

  private edLevel: EditionLevelType;

  @Input() analogue: Analogue;

  @Input() set editionLevel(el: EditionLevelType) {
    this.edLevel = el;
    this.editionLevelChange.next(el);
  }
  get editionLevel() { return this.edLevel; }
  editionLevelChange = new BehaviorSubject<EditionLevelType | ''>('');

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

}

