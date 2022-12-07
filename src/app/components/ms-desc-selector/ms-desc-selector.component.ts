import { EventEmitter, Output, ViewChild } from '@angular/core';
import { Component, Input } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { EVTModelService } from 'src/app/services/evt-model.service';

@Component({
  selector: 'evt-ms-desc-selector',
  templateUrl: './ms-desc-selector.component.html',
  styleUrls: ['./ms-desc-selector.component.scss'],
})
export class MsDescSelectorComponent {
  public msDesc$ = this.evtModelService.msDesc$;

  @Output() selectionChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() msDescOpen: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('ngSelectComponent') ngSelectComponent: NgSelectComponent;

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

  openMsDescContent() {
    this.selectionChange.emit(this.msDescID);
    this.msDescOpen.emit(true);
  }

  resetMsDesc() {
    this.msDescOpen.emit(false);
  }
}
