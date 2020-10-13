import { Component, Input } from '@angular/core';
import { take } from 'rxjs/operators';

import { NamedEntityOccurrence, NamedEntityOccurrenceRef } from '../../../models/evt-models';
import { EVTModelService } from '../../../services/evt-model.service';
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
    private evtModelService: EVTModelService,
    private evtStatusService: EVTStatusService,
  ) {
  }

  goToOccurrenceRef(ref: NamedEntityOccurrenceRef) {
    this.evtModelService.pages$.pipe(take(1)).subscribe(pages => {
      const page = pages.find(p => p.id === this.occurrence.pageId);
      this.evtStatusService.updateDocument$.next(ref.docId);
      this.evtStatusService.updatePage$.next(page);
      this.evtStatusService.currentNamedEntityId$.next(this.entityId);
    });
  }
}
