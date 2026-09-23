import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EVTStatusService } from 'src/app/services/evt-status.service';
import { Note, NoteClass } from '../../models/evt-models';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { EditionLevelType } from 'src/app/app.config';

@Component({
  selector: 'evt-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesComponent {
  @Input() pageID: string;

  @Input() set editionLevel(el: EditionLevelType) {
    this.edLevel = el;
    this.editionLevelChange.next(el);
  }
  get editionLevel() { return this.edLevel; }
  editionLevelChange = new BehaviorSubject<EditionLevelType | ''>('');
  private edLevel: EditionLevelType;

  private noteClasses = [NoteClass];
  public notesInCurrentPage = this.evtStatusService.getPageElementsByClassList(this.noteClasses)
  public notes$: Observable<Note[]> = this.notesInCurrentPage.pipe(
    map(data => data.flat() )
  )

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  constructor(
    public evtStatusService: EVTStatusService,
  ) { }
}
