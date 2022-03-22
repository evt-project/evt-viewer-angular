import { Component, Input } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ViewerDataType } from '../../models/evt-models';
import { EVTModelService } from '../../services/evt-model.service';

@Component({
  selector: 'evt-image-panel',
  templateUrl: './image-panel.component.html',
  styleUrls: ['./image-panel.component.scss'],
})
export class ImagePanelComponent {
  @Input() viewerData: ViewerDataType;

  currentMsDescId$ = new BehaviorSubject(undefined);
  currentMsDesc$ = combineLatest([this.evtModelService.msDesc$, this.currentMsDescId$]).pipe(
    filter(([msDesc, currentId]) => !!msDesc && !!currentId),
    map(([msDesc, currentId]) => msDesc.find(m => m.id === currentId)),
  );

  msDescOpen = false;

  constructor(
    private evtModelService: EVTModelService,
  ) {
  }

  setMsDescOpen(isOpen: boolean) {
    this.msDescOpen = isOpen;
  }

  setMsDescID(msDescId: string) {
    this.currentMsDescId$.next(msDescId);
  }
}
