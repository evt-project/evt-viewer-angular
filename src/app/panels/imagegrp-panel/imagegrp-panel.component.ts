import {AfterViewInit, Component, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, combineLatest, merge, Observable, Subject} from 'rxjs';
import {distinctUntilChanged, filter, first, map, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import { Page,  ViewerDataType } from '../../models/evt-models';
import { EVTModelService } from '../../services/evt-model.service';
import { EvtLinesHighlightService  } from '../../services/evt-lines-highlight.service';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'evt-imagegrp-panel',
  templateUrl: './imagegrp-panel.component.html',
  styleUrls: ['./imagegrp-panel.component.scss'],
})
export class ImageGrpPanelComponent implements OnDestroy, OnInit, AfterViewInit{

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
  pageNumber$ = this.currentPageId$.pipe(
    withLatestFrom(this.evtModelService.surfacesGrpPages$),
    map(([pageId, pages]) => pages.findIndex((page) => page.id === pageId)),
  );

  currentSurfacesGrpPage$ = this.currentPageId$.pipe(
      tap((pageId)=>{
        console.log('current page id', pageId)
      }),
    withLatestFrom( this.evtModelService.surfacesGrpPages$),


    map(([pageId, surfacesGrp]) =>  surfacesGrp.find((surfaceGrp) => surfaceGrp.id === pageId)),
  );
  selectedPage$ = this.currentSurfacesGrpPage$.pipe(
      filter(sGrp => sGrp !== undefined),
      map(sGrp=>{
        // const titleName = sGrp.surfaces.reduce((pv, cv)=>{
        //   if (pv.length === 0){
        //     return pv+cv.corresp.replace('#', '');
        //   }
        //   return pv+' '+cv.corresp.replace('#', '');
        //
        // }, '');
        // return titleName;
        return sGrp.id;
      }),
  );

  pages$ = this.evtModelService.surfacesGrpPages$;

  currentSurfacesGrp$ = this.evtModelService.surfacesGrp$.pipe(
      withLatestFrom(this.currentSurfacesGrpPage$),
      map(([surfacesGrp, currentPage])=>{
        if (!currentPage) {
          return surfacesGrp[0];
        }

        return surfacesGrp.find(sGrp => {
          const id = sGrp.surfaces.reduce((pv, cv) => {
            if (pv.length === 0) {
              return pv + cv.corresp.replace('#', '');
            }
            return pv + '-' + cv.corresp.replace('#', '');

          }, '');
          return id === currentPage.id;
        });
      })
  )

  currentSurfaces$ = this.currentSurfacesGrp$.pipe(
      filter(sg => sg !== undefined),
    map(sg=> sg.surfaces[0])
  );

  @Output() pageChange: Observable<Page> = merge(
    this.updatePageNumber$.pipe(

      filter((n) => n !== undefined),
      withLatestFrom(this.evtModelService.surfacesGrpPages$),
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
  ) {



  }
  ngOnDestroy(): void {
    this.linesHighlightService.lineBeginningSelected$.next([]);
    this.linesHighlightService.syncTextImage$.next(false);

    this.unsubscribeAll$.next();
    this.unsubscribeAll$.complete();
  }

  ngAfterViewInit(): void{

    if (this.indipendentNavBar){
      this.evtModelService.surfacesGrpPages$.pipe(
         // delay(50),
          first(),
      ).subscribe((pages)=>{
        const idx = this.panelNumber > pages.length ? 0: this.panelNumber;
        const cp = pages[idx];
        this.currentPage$.next(cp);
        this.updatePageNumber$.next(idx);
        this.pageID = cp?.id ?? '';
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
    } else{
      this.evtModelService.surfacesGrpPages$.pipe(
          first(),

      ).subscribe((pages)=>{

        const cp = pages[0];
        this.currentPage$.next(cp);
        this.updatePageNumber$.next(0);
        this.pageID = cp.id;

      });
    }
  }
  ngOnInit(): void{


  }
  // syncTextImage() {
  //   this.isSyncButtonActive = this.isSyncButtonActive === 'active' ? '' : 'active';
  //   if (this.isSyncButtonActive === ''){
  //     this.linesHighlightService.lineBeginningSelected$.next([]);
  //   }
  //   this.linesHighlightService.syncTextImage$.next(this.isSyncButtonActive === 'active');
  // }

  updatePage(viewerPage: number) {
    this.updatePageNumber$.next(viewerPage > 0 ? viewerPage - 1 : 0);
    this.evtModelService.surfacesGrpPages$.pipe(
        first(),
    ).subscribe(pages=>{
      const page = pages[viewerPage-1];
      this.currentPage$.next(page)
    })
  }
  onPageChange(pageId: string){

    this.pageID = pageId;
    this.evtModelService.surfacesGrpPages$.pipe(
        first(),
    ).subscribe(pages=>{
      const page = pages.find(p => p.id === pageId)
      this.currentPage$.next(page)
    })

  }
  // setMsDescOpen(isOpen: boolean) {
  //   this.msDescOpen = isOpen;
  // }
  //
  // setMsDescID(msDescId: string) {
  //   this.currentMsDescId$.next(msDescId);
  // }

  onChangedCurrentPage(page:number) {

    this.evtModelService.surfacesGrpPages$.pipe(
      map((pages) => page < 0 ? pages[pages.length - 1] : pages[page]),
      first(),
    ).subscribe(
      (currentPage:Page ) => {
          this.currentPage$.next(currentPage);

        },
      );
  }
}
