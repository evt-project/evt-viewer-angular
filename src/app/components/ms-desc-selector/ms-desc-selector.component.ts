import { Component } from '@angular/core';
import { EVTModelService } from '../../services/evt-model.service';

@Component({
  selector: 'evt-ms-desc-selector',
  templateUrl: './ms-desc-selector.component.html',
  styleUrls: ['./ms-desc-selector.component.scss'],
})
export class MsDescSelectorComponent {
  public msDesc$ = this.evtModelService.msDesc$;
  public secondaryContent = '';

  constructor(
    private evtModelService: EVTModelService,
  ) {
  }

}
