import { AfterViewInit, Component, Input, OnDestroy, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, first, map, startWith, takeUntil,  withLatestFrom } from 'rxjs/operators';
import { Page,  ViewerDataType } from '../../models/evt-models';
import { EVTModelService } from '../../services/evt-model.service';
import { EvtLinesHighlightService  } from '../../services/evt-lines-highlight.service';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'evt-imagegrp-panel',
  templateUrl: './imagegrp-panel.component.html',
  styleUrls: ['./imagegrp-panel.component.scss'],
})
export class ImageGrpPanelComponent implements OnDestroy, AfterViewInit{

  @Input() panelNumber:number;

  @Input() viewerData: ViewerDataType;

  @Input() pageID: string;

  @Input() showHeader = true;
  @Input() indipendentNavBar = false;
  // @Input() sync = false;
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
  updatePageNumber$$ = this.updatePageNumber$.asObservable().pipe(
    startWith(0),
    filter((pageNumber) => pageNumber !== null && pageNumber !== undefined),
    distinctUntilChanged(),
    debounceTime(40),
  );
  pageNumber$ = this.currentPageId$.pipe(
    withLatestFrom(this.evtModelService.imageDoublePages$),
    map(([pageId, pages]) => pages.findIndex((page) => page.id === pageId)),
  );

  currentImageOnlyPage$ = this.currentPageId$.pipe(
      // tap((pageId)=>{
      //   console.log('current page id', pageId)
      // }),
    withLatestFrom( this.evtModelService.imageDoublePages$),


    map(([pageId, imageOnlyPages]) =>  {
      const p = imageOnlyPages?.find((imageOnlyPage) => imageOnlyPage.id === pageId);

      return p ? p : imageOnlyPages ? imageOnlyPages[0] : undefined;
    }),
  );
  selectedPage$ = this.currentImageOnlyPage$.pipe(
      filter((imageOnlyPage) => imageOnlyPage !== undefined),
      map((imageOnlyPage)=>imageOnlyPage.id),
  );

  pages$ = this.evtModelService.imageDoublePages$;

  @Output() pageChange: Observable<Page> = merge(
    this.updatePageNumber$.pipe(

      filter((n) => n !== undefined),
      withLatestFrom(this.evtModelService.imageDoublePages$),
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
      this.evtModelService.imageDoublePages$.pipe(
          first(),
      ).subscribe((imageOnlyPages)=>{
        if (imageOnlyPages){
          const idx = this.panelNumber > imageOnlyPages?.length ? 0: this.panelNumber;
          const cp = imageOnlyPages[idx];
          this.currentPage$.next(cp);
          this.updatePageNumber$.next(idx);
          this.pageID = cp?.id ?? '';
        }
      });

      this.pageChange.pipe(
          takeUntil(this.unsubscribeAll$),
      ).subscribe(( (currentPage) => {

        if (this.indipendentNavBar && currentPage) {

          this.pageID = currentPage.id;
        }
      }));
    } else{
      this.evtModelService.imageDoublePages$.pipe(
          first(),

      ).subscribe((imageOnlyPages)=>{

        const cp = imageOnlyPages[0];
        this.currentPage$.next(cp);
        this.updatePageNumber$.next(0);
        this.pageID = cp.id;

      });
    }
  }

  updatePage(viewerPage: number) {
    this.updatePageNumber$.next(viewerPage > 0 ? viewerPage - 1 : 0);
    this.evtModelService.imageDoublePages$.pipe(
        first(),
    ).subscribe((imageOnlyPages)=>{
      const page = imageOnlyPages[viewerPage-1];
      this.currentPage$.next(page)
    })
  }
  onPageChange(pageId: string){

    this.pageID = pageId;
    this.evtModelService.imageDoublePages$.pipe(
        first(),
    ).subscribe((imageOnlyPages)=>{
      const page = imageOnlyPages.find((p) => p.id === pageId)
      this.currentPage$.next(page)
    })

  }

  onChangedCurrentPage(page:number) {

    this.evtModelService.imageDoublePages$.pipe(
      map((imageOnlyPages) => page < 0 ? imageOnlyPages[imageOnlyPages.length - 1] : imageOnlyPages[page]),
      first(),
    ).subscribe(
      (currentPage:Page ) => {
          if (currentPage){
            this.currentPage$.next(currentPage);
          }

        },
      );
  }
}
