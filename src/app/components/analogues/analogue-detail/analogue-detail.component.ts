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
  public analogueEntry: Analogue;
  public headVisible: boolean;
  public detailVisible: boolean;

  @Input() set analogue(el: Analogue) {
    this.analogueEntry = el;
    this.checkVisibility(el);
  }
  get analogue() { return this.analogueEntry; }

  @Input() set editionLevel(el: EditionLevelType) {
    this.edLevel = el;
    this.editionLevelChange.next(el);
  }
  get editionLevel() { return this.edLevel; }
  editionLevelChange = new BehaviorSubject<EditionLevelType | ''>('');

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  checkVisibility(anl: Analogue) {
    this.headVisible = ((anl.sources.length > 0) || (anl.extSources.length > 0) || (anl.text.length > 0) || (anl.extLinkedElements.length > 0));
    this.detailVisible = (anl.sources.length > 0 || anl.extSources.length > 0 || anl.quotedElements.length > 0);
  }
}
