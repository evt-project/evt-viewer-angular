import { Component, Input, Output } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { EVTModelService } from '../../services/evt-model.service';

@Component({
  selector: 'evt-ms-desc-selector',
  templateUrl: './ms-desc-selector.component.html',
  styleUrls: ['./ms-desc-selector.component.scss'],
})
export class MsDescSelectorComponent {
  public msDesc$ = this.evtModelService.msDesc$;

  // tslint:disable-next-line: variable-name
  private _msDescID: string;
  @Input() set msDescID(p: string) {
     this._msDescID = p;
     this.selectedMsDesc$.next(this._msDescID);
   }

  get msDescID() { return this._msDescID; } // id dell'msDesc selezionato nel selettore

  selectedMsDesc$ = new BehaviorSubject<string>(undefined);

  @Output() selectionChange = combineLatest([
    this.msDesc$,
    this.selectedMsDesc$.pipe(distinctUntilChanged()),
  ]).pipe(
    filter(([msDesc, msDescID]) => !!msDescID && !!msDesc && msDesc.length > 0),
    map(([msDesc, msDescID]) => msDesc.find(p => p.id === msDescID)),
  );

  constructor(
    private evtModelService: EVTModelService,
  ) {
  }

}
