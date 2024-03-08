import { Component, Input,  OnInit } from '@angular/core';
import { Note, Paragraph, Verse, VersesGroup } from 'src/app/models/evt-models';

@Component({
  selector: 'evt-source-note',
  templateUrl: './source-note.component.html',
  styleUrls: ['../../sources/sources.component.scss'],
})
export class SourceNoteComponent implements OnInit {
  public _data: Paragraph|Verse|VersesGroup;
  public dataForNote = {};

  @Input() set data(dt: Paragraph|Verse|VersesGroup) {
    this._data = dt;
  }

  get data() { return this._data }

  createNote(v, type): Note {
    const item = v[type];
    let content = item.extSources || [];
    if (type === 'analogue') {
      content.push( item.extLinkedElements );
      content.push( item.sources );
    }
    if (type === 'source') {
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
