import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EditionLevelType } from 'src/app/app.config';
import { Note } from 'src/app/models/evt-models';

@Component({
  selector: 'evt-note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['../../sources/sources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteDetailComponent {

  private edLevel: EditionLevelType;

  public noteEntry: Note;

  public headVisible: boolean;

  public detailVisible: boolean;

  @Input() set note(el: Note) {
    this.noteEntry = el;
  }
  get note() { return this.noteEntry; }

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

