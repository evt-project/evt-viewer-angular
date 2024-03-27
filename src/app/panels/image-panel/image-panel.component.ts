import { AfterViewInit, Component, Input, OnDestroy, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, first, map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Page,  ViewerDataType } from '../../models/evt-models';
import { EVTModelService } from '../../services/evt-model.service';
import { EvtLinesHighlightService  } from '../../services/evt-lines-highlight.service';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'evt-image-panel',
  templateUrl: './image-panel.component.html',
  styleUrls: ['./image-panel.component.scss'],
})
export class ImagePanelComponent implements OnDestroy, AfterViewInit{

  @Input() panelNumber:number;

  @Input() viewerData: ViewerDataType;

  @Input() pageID: string;

  @Input() showHeader = true;
  @Input() indipendentNavBar = false;
  private _showSyncButton = true;
  private unsubscribeAll$ = new Subject<void>();
  @Input()
  public get showSyncButton() {
    return this._showSyncButton;
  }
  public set showSyncButton(value) {
    if (!value){
      this.isSyncButtonActive = '';
      this.linesHighlightService.syncTextImage$.next(false);
    }
    this._showSyncButton = value && AppConfig.evtSettings.ui.syncZonesHighlightButton;
  }

  isSyncButtonActive: '' | 'active' = '';
  // public syncTextImage$ = new BehaviorSubject<boolean>(false);
  public currentPage$ = new BehaviorSubject<Page>(undefined);
  public currentPageId$ = this.currentPage$.pipe(
    map((p) => p?.id),
  );
  updatePageNumber$ = new Subject<number>();
  pageNumber$ = this.currentPageId$.pipe(
    withLatestFrom(this.evtModelService.pages$),
    map(([pageId, pages]) => pages.findIndex((page) => page.id === pageId)),
  );

  currentSurfaces$ = this.currentPageId$.pipe(
    withLatestFrom(this.evtModelService.surfaces$),
    map(([pageId, surfaces]) =>  surfaces.find((surface) => surface.corresp === pageId)),
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
     private linesHighlightService: EvtLinesHighlightService,
  ) {}

  ngOnDestroy(): void {
    this.linesHighlightService.lineBeginningSelected$.next([]);
    this.linesHighlightService.syncTextImage$.next(false);

    this.unsubscribeAll$.next();
    this.unsubscribeAll$.complete();
  }

  ngAfterViewInit(): void{

    if (this.indipendentNavBar){
      this.evtModelService.pages$.pipe(
         // delay(50),
          first(),
      ).subscribe((pages)=>{
        const idx = this.panelNumber > pages.length ? 0: this.panelNumber;
        const cp = pages[idx];
        this.currentPage$.next(cp);
        this.updatePageNumber$.next(idx);
        this.pageID = cp.id;
        // setTimeout(()=>{
        //   this.updatePageNumber$.next(idx);
        // },100)
      });

      this.pageChange.pipe(
          takeUntil(this.unsubscribeAll$),
      ).subscribe(( (currentPage) => {

        if (this.indipendentNavBar && currentPage) {

          this.pageID = currentPage.id;
        }
      }));
    }
  }

  syncTextImage() {
    this.isSyncButtonActive = this.isSyncButtonActive === 'active' ? '' : 'active';
    if (this.isSyncButtonActive === ''){
      this.linesHighlightService.lineBeginningSelected$.next([]);
    }
    this.linesHighlightService.syncTextImage$.next(this.isSyncButtonActive === 'active');
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

  onChangedCurrentPage(page:number) {

    this.evtModelService.pages$.pipe(
      map((pages) => page < 0 ? pages[pages.length - 1] : pages[page]),
      first(),
    ).subscribe(
      (currentPage:Page ) => {
          this.currentPage$.next(currentPage);

        },
      );
  }
}
