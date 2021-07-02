import { EventEmitter, Output } from '@angular/core';
import { Component, Input } from '@angular/core';
import { EVTModelService } from 'src/app/services/evt-model.service';

@Component({
  selector: 'evt-ms-desc-selector',
  templateUrl: './ms-desc-selector.component.html',
  styleUrls: ['./ms-desc-selector.component.scss'],
})
export class MsDescSelectorComponent {
  public msDesc$ = this.evtModelService.msDesc$;

  @Output() IDMsDesc: EventEmitter<string> = new EventEmitter<string>();

  @Output() msDescOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  // tslint:disable-next-line: variable-name
  private _msDescID: string;
  @Input() set msDescID(p: string) {
     this._msDescID = p;
   }

  get msDescID() { return this._msDescID; }

  constructor(
    public evtModelService: EVTModelService,
  ) {
  }

  openMsDescContent(){
    this.IDMsDesc.emit(this.msDescID);
    this.msDescOpen.emit(true);
  }

  resetMsDesc(){
    this.msDescOpen.emit(false);
  }
}
