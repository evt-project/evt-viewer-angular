import { Component, Input } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { EVTStatusService } from 'src/app/services/evt-status.service';
import { Page, ViewerDataType } from '../../models/evt-models';
import { EVTModelService } from '../../services/evt-model.service';

@Component({
  selector: 'evt-image-panel',
  templateUrl: './image-panel.component.html',
  styleUrls: ['./image-panel.component.scss'],
})
export class ImagePanelComponent{
  @Input() viewerData: ViewerDataType;

  // tslint:disable-next-line: variable-name
  private _pageNumber: number;
  @Input() set pageID(v: string) {
      this.evtModelService.pages$.pipe(
        take(1)).subscribe((pages) => this._pageNumber = pages.findIndex(page => page.id === v));
  }
  get pageNumber(): number { return this._pageNumber + 1; }

  public currentPage$ = new BehaviorSubject<Page>(undefined);
  public currentPageId$ = this.currentPage$.pipe(
    map(p => p?.id),
  );

  currentMsDescId$ = new BehaviorSubject(undefined);
  currentMsDesc$ = combineLatest([this.evtModelService.msDesc$, this.currentMsDescId$]).pipe(
    filter(([msDesc, currentId]) => !!msDesc && !!currentId),
    map(([msDesc, currentId]) => msDesc.find(m => m.id === currentId)),
  );

  msDescOpen = false;

  constructor(
    private evtModelService: EVTModelService,
    private evtStatus: EVTStatusService,
  ) {
  }

  updatePage(viewerPage: number){
    this.evtModelService.pages$.pipe(take(1)).subscribe(
      (pages) => this.evtStatus.updatePage$.next(pages[viewerPage - 1]),
    );
  }

  setMsDescOpen(isOpen: boolean) {
    this.msDescOpen = isOpen;
  }

  setMsDescID(msDescId: string) {
    this.currentMsDescId$.next(msDescId);
  }
}
