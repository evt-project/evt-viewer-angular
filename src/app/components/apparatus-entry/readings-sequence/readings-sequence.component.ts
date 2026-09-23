import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { Reading } from 'src/app/models/evt-models';

@Component({
  selector: 'evt-readings-sequence',
  templateUrl: './readings-sequence.component.html',
  styleUrls: ['../../mod/mod-sequence/mod-sequence.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadingsSequenceComponent {

  public sequence: Reading[];

  public showSeqAttr = AppConfig.evtSettings.edition.changeSequenceView.showSeqAttr;
  public showVarSeqAttr = AppConfig.evtSettings.edition.changeSequenceView.showVarSeqAttr;

  public Reading = Reading;

  @Input() set data(el: Reading[]) {
    this.sequence = Array.from(el)
      .filter(r => r != null)
      .sort((a, b) => {
        const aSeq = a.varSeq ?? Number.MAX_SAFE_INTEGER;
        const bSeq = b.varSeq ?? Number.MAX_SAFE_INTEGER;
        return aSeq - bSeq;
      });
  }

  get data() { return this.sequence; }

}

