import { ChangeDetectionStrategy, Component, Input,  OnInit } from '@angular/core';
import { Note, Paragraph, Verse, VersesGroup } from 'src/app/models/evt-models';

@Component({
  selector: 'evt-source-note',
  templateUrl: './source-note.component.html',
  styleUrls: ['../../sources/sources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceNoteComponent implements OnInit {

  public _data: Paragraph|Verse|VersesGroup;

  @Input() set data(dt: Paragraph|Verse|VersesGroup) {
    this._data = dt;
  }

  get data() { return this._data }

  public dataForNote = {};

  createNote(v, type): Note {

    const item = v[type];
    let content = item.extSources || [];

    if (type === 'analogue') {
      content.push( item.extLinkedElements );
      content.push( item.sources );
    } else if (type === 'source') {
      content.push( item.extElements );
    }

    return <Note> {
      type: Note,
      noteType: type,
      noteLayout: 'popover',
      exponent: v.path || '',
      content: content,
      attributes: v.attributes || [],
    }
  }

  ngOnInit() {
    if (this.data.source !== null) {
      this.dataForNote = this.createNote(this.data, 'source');
    }
    if (this.data.analogue !== null) {
      this.dataForNote = this.createNote(this.data, 'analogue');
    }
  }


}
