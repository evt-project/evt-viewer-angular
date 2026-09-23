import { Component, Input, OnInit } from '@angular/core';
import { Attribute } from 'src/app/models/evt-models';
import { EVTStatusService } from 'src/app/services/evt-status.service';
import { ApparatusEntryDetailService } from '../apparatus-entry/apparatus-entry-detail/apparatus-entry-detail.service';

@Component({
  selector: 'evt-witness-metadata',
  templateUrl: './witness-metadata.component.html',
  styleUrls: ['./witness-metadata.component.scss']
})
export class WitnessMetadataComponent implements OnInit {
  @Input() witnessMetadata: string;

  ids: string[] = [];

  constructor(
    private statusService: EVTStatusService,
    private apparatusEntryDetailService: ApparatusEntryDetailService
  ) { }

  ngOnInit(): void {
    const witnessMetadata = this.witnessMetadata;
    if (witnessMetadata.includes(' ')) {
      const witnessIds = witnessMetadata.split(' ');
      this.ids = witnessIds.filter(x => !!x);
    }
    else {
      this.ids = [witnessMetadata];
    }
  }

  onWitnessClicked(witnessId: string) {
    const witnessAttrId = Attribute.create(witnessId).valueWithoutRef;
    this.statusService.updateViewMode$.next(this.statusService.availableViewModes.find(v => v.id === 'collation'));
    let newValue = [...this.statusService.updateWitnesses$.value, witnessAttrId];
    newValue = newValue.filter(this.onlyUnique);
    this.statusService.updateWitnesses$.next(newValue);
    this.statusService.updateApparatus$.next(this.apparatusEntryDetailService.apparatusEntry.exponent);
  }

  private onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }
}
