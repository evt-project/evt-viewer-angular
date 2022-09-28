import { Component, Input } from '@angular/core';

import { NamedEntityOccurrence, NamedEntityOccurrenceRef } from '../../../models/evt-models';
import { EVTStatusService } from '../../../services/evt-status.service';

@Component({
  selector: 'evt-named-entity-occurrence',
  templateUrl: './named-entity-occurrence.component.html',
  styleUrls: ['./named-entity-occurrence.component.scss'],
})
export class NamedEntityOccurrenceComponent {
  @Input() occurrence: NamedEntityOccurrence;
  @Input() entityId: string;

  constructor(
    private evtStatusService: EVTStatusService,
  ) {
  }

  goToOccurrenceRef(ref: NamedEntityOccurrenceRef) {
    this.evtStatusService.updateDocument$.next(ref.docId);
    this.evtStatusService.currentNamedEntityId$.next(this.entityId);
    this.evtStatusService.updatePageId$.next(this.occurrence.pageId);
  }
}
