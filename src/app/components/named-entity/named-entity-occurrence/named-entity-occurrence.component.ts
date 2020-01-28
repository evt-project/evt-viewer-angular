import { Component, Input } from '@angular/core';
import { NamedEntityOccurrence } from 'src/app/models/evt-models';

@Component({
  selector: 'evt-named-entity-occurrence',
  templateUrl: './named-entity-occurrence.component.html',
  styleUrls: ['./named-entity-occurrence.component.scss'],
})
export class NamedEntityOccurrenceComponent {
  @Input() occurrence: NamedEntityOccurrence;
}
