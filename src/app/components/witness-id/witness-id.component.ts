import { Component, EventEmitter, Input, Output } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { Attribute, GenericElement } from 'src/app/models/evt-models';
import { EVTModelService } from 'src/app/services/evt-model.service';
import { ParseResult } from 'src/app/services/xml-parsers/parser-models';

@Component({
  selector: 'evt-witness-id',
  templateUrl: './witness-id.component.html',
  styleUrls: ['./witness-id.component.scss']
})
export class WitnessIdComponent {
  @Input() witnessId: string;
  @Output() witnessClicked = new EventEmitter<string>();

  witnessItem$: Observable<WitnessItem> = this.modelService.flattenedWitnesses$.pipe(
    map(witnesses => {
      const witnessId = Attribute.create(this.witnessId);
      const witness = witnesses.find(y => witnessId.equals(y.id));
      if (!witness) {
        console.warn("Cannot find witness with id: ", this.witnessId)
        return;
      }

      if (witness.label) {
        return {
          id: null,
          label: witness.label
        }
      }
      else {
        return { id: witness.id }
      }
    }),
    shareReplay(1)
  );

  get isClickable() {
    return this.witnessClicked.observed; // checks if the EventEmitter has been binded in the parent
  }

  constructor(
    private modelService: EVTModelService,
  ) { }

  onWitnessClicked() {
    this.witnessClicked.emit(this.witnessId);
  }
}

export interface WitnessItem {
  id?: string,
  label?: ParseResult<GenericElement>
} 