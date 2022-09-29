import { Component, Input, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, withLatestFrom } from 'rxjs/operators';
import { Page, ViewerDataType } from '../../models/evt-models';
import { EVTModelService } from '../../services/evt-model.service';

@Component({
  selector: 'evt-image-panel',
  templateUrl: './image-panel.component.html',
  styleUrls: ['./image-panel.component.scss'],
})
export class ImagePanelComponent {
  @Input() viewerData: ViewerDataType;

  @Input() pageID: string;

  public currentPage$ = new BehaviorSubject<Page>(undefined);
  public currentPageId$ = this.currentPage$.pipe(
    map((p) => p?.id),
  );
  updatePageNumber$ = new Subject<number>();
  pageNumber$ = this.currentPageId$.pipe(
    withLatestFrom(this.evtModelService.pages$),
    map(([pageId, pages]) => pages.findIndex((page) => page.id === pageId)),
  );
  @Output() pageChange: Observable<Page> = merge(
    this.updatePageNumber$.pipe(
      filter((n) => n !== undefined),
      withLatestFrom(this.evtModelService.pages$),
      map(([n, pages]) => pages[n]),
    ),
    this.currentPage$.pipe(
      filter((p) => !!p),
      distinctUntilChanged(),
    ));

  currentMsDescId$ = new BehaviorSubject(undefined);
  currentMsDesc$ = combineLatest([this.evtModelService.msDesc$, this.currentMsDescId$]).pipe(
    filter(([msDesc, currentId]) => !!msDesc && !!currentId),
    map(([msDesc, currentId]) => msDesc.find((m) => m.id === currentId)),
  );

  msDescOpen = false;

  constructor(
    private evtModelService: EVTModelService,
  ) {
  }

  updatePage(viewerPage: number) {
    this.updatePageNumber$.next(viewerPage > 0 ? viewerPage - 1 : 0);
  }

  setMsDescOpen(isOpen: boolean) {
    this.msDescOpen = isOpen;
  }

  setMsDescID(msDescId: string) {
    this.currentMsDescId$.next(msDescId);
  }
}
