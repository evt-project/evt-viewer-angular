import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EditionLevelType } from 'src/app/app.config';

@Component({
  selector: 'evt-source-detail',
  templateUrl: './source-detail.component.html',
  styleUrls: ['../../sources/sources.component.scss'],
})
export class SourceDetailComponent {

  private edLevel: EditionLevelType;

  @Input() source;

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

