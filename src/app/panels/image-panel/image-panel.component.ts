import { Component, Input } from '@angular/core';
import { EVTModelService } from 'src/app/services/evt-model.service';
import { AppConfig } from '../../app.config';

@Component({
  selector: 'evt-image-panel',
  templateUrl: './image-panel.component.html',
  styleUrls: ['./image-panel.component.scss'],
})
export class ImagePanelComponent {
  manifest = AppConfig.evtSettings.files.manifestURL !== '' && !!AppConfig.evtSettings.files.manifestURL
    ? AppConfig.evtSettings.files.manifestURL
    : undefined;

  public msDesc$ = this.evtModelService.msDesc$;

  // tslint:disable-next-line: variable-name
  private _msDescID: string;
  @Input() set msDescID(p: string) {
     this._msDescID = p;
   }

  get msDescID() { return this._msDescID; }

  private showSecondaryContent = false;

  constructor(
    public evtModelService: EVTModelService,
  ) {
  }

  isSecondaryContentOpened(): boolean {
    return this.showSecondaryContent;
  }

  toggleMsDescContent(){
    this.showSecondaryContent = true;
  }

  resetMsDesc(){
    this.showSecondaryContent = false;
  }
}
