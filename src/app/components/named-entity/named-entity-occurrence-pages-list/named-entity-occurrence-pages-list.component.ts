import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EditionOccurrences } from '../named-entity.component';
import { NamedEntityOccurrenceRef } from 'src/app/models/evt-models';

@Component({
  selector: 'evt-named-entity-occurrence-pages-list',
  templateUrl: './named-entity-occurrence-pages-list.component.html',
  styleUrls: ['./named-entity-occurrence-pages-list.component.scss']
})
export class NamedEntityOccurrencePagesListComponent implements OnInit {
  @Input() occurrences: EditionOccurrences[];
  @Output() onItemClicked = new EventEmitter<NamedEntityOccurrenceRef>();

  constructor() { }

  ngOnInit(): void {
  }

  itemClicked(ref: NamedEntityOccurrenceRef) {
    this.onItemClicked.emit(ref);
  }
}
