import { Component, Input } from '@angular/core';

import { NamedEntityOccurrence, NamedEntityOccurrenceRef } from '../../../models/evt-models';
import { EVTStatusService } from '../../../services/evt-status.service';
import { EditionInfo } from 'src/app/services/named-entities.service';
import { EVTModelService } from 'src/app/services/evt-model.service';

@Component({
  selector: 'evt-named-entity-occurrence',
  templateUrl: './named-entity-occurrence.component.html',
  styleUrls: ['./named-entity-occurrence.component.scss'],
})
export class NamedEntityOccurrenceComponent {
  @Input() occurrence: NamedEntityOccurrence;
  @Input() entityId: string;
  @Input() editionInfo: EditionInfo;

  get occurrenceContent() {
    try {
      const text = this.occurrence.refsByDoc[0].refs[0].content[0] as any;
      return text.text;
    }
    catch (e: any) {
      console.error(e);
      console.log('occurrence', this.occurrence);
      return 'parsing failed';
    }
  }

  constructor(
    private evtStatusService: EVTStatusService,
    private evtModelService: EVTModelService,
  ) {
  }

  goToOccurrenceRef(ref: NamedEntityOccurrenceRef) {
    this.evtStatusService.updateDocument$.next(ref.docId);
    this.evtStatusService.currentNamedEntityId$.next(this.entityId);
    this.evtModelService.updateEditionId$.next(this.editionInfo.editionId);
    this.evtStatusService.updatePageId$.next(this.occurrence.pageId);
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }
}
