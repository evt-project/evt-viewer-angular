import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ApparatusEntry, Reading } from '../../../models/evt-models';
import { register } from '../../../services/component-register.service';
import { EVTModelService } from '../../../services/evt-model.service';
@Component({
  selector: 'evt-apparatus-entry-detail',
  templateUrl: './apparatus-entry-detail.component.html',
  styleUrls: ['./apparatus-entry-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

@register(ApparatusEntryDetailComponent)
export class ApparatusEntryDetailComponent {
  @Input() data: ApparatusEntry;
  @Input() nestedApps: ApparatusEntry[];
  rdgHasCounter = true;

  get significantRdg(): Reading[] {
    return this.data.readings.filter((rdg) => rdg.significant);
  }

  get notSignificantRdg(): Reading[] {
    return this.data.readings.filter((rdg) => !rdg.significant);
  }

  get readings(): Reading[] {
    return [this.data.lemma].concat(this.significantRdg).concat(this.notSignificantRdg);
  }

  get rdgMetadata() {
    return Object.keys(this.data.attributes).filter((key) => key !== 'id')
      .reduce((obj, key) => {
        obj[key] = this.data.attributes[key];

        return obj;
      },      {});
  }

  constructor(
    public evtModelService: EVTModelService,
  ) {
  }
}
