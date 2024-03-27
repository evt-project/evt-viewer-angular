import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject,  switchMap } from 'rxjs';
import { delay, distinctUntilChanged, filter, first, map, scan, startWith, withLatestFrom } from 'rxjs/operators';
// import { AppConfig } from '../app.config';
import { EVTModelService } from '../services/evt-model.service';
import { EVTStatusService } from '../services/evt-status.service';

@Component({
  selector: 'evt-nav-bar-image',
  templateUrl: './nav-bar-image.component.html',
  styleUrls: ['./nav-bar-image.component.scss'],
})
export class NavBarImageComponent {
    private showSinglePage$ = new BehaviorSubject<boolean>(true);
  @Input() set showSinglePage(value: boolean){
      this.showSinglePage$.next(value);
  }
  @Input() set currentIndexPage(value:number | null){
    if (value){
        this.currentPageIndex$.next(value);
    } else {
        this.currentPageIndex$.next(0);
    }
  };

  @Input() panelNumber:number;

  private _showSyncImageButton = true;
  @Input()
  public get showSyncImageButton() {
    return this._showSyncImageButton;
  }

  @Output() changeIndexPage = new EventEmitter<number>();
  updateThContainerInfo$ = new Subject<HTMLElement | void>();
  thContainerInfo$ = this.updateThContainerInfo$.pipe(
    scan((currentEl, val) => val || currentEl, undefined),
    filter((thContainer) => !!thContainer),
    map((thContainer: HTMLElement) => ({
      width: thContainer.clientWidth,
      height: thContainer.clientHeight,
      thumbWidth: parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--thumbnail-width'), 10),
      thumbHeight: parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--thumbnail-height'), 10),
    })),
  );
  @ViewChild('thumbnailsContainer') set thumbnailsContainer(el: ElementRef) {
    this.updateThContainerInfo$.next(el?.nativeElement);
  }

  thViewerSettings$ = this.thContainerInfo$.pipe(
    delay(0),
    map(({ width, height, thumbHeight, thumbWidth }) => ({
      col: Math.floor(width / thumbWidth),
      row: Math.floor(height / thumbHeight),
    })),
    startWith({ col: 1, row: 1 }),
  );

  // currentPageIndexStatic;
  // currentPageIndex$ = this.evtStatusService.currentPage$.pipe(
  //   withLatestFrom(this.evtModelService.pages$),
  //   filter((p) => !!p),
  //   map(([page, pages]) => pages.findIndex((p) => p.id === page.id)),
  //   tap((i) => this.currentPageIndexStatic = i),
  // );

  currentPageIndex$ = new BehaviorSubject<number>(0);

  thumbnailsButton =  true; //AppConfig.evtSettings.ui.thumbnailsButton;
  toggleThumbnailsPanel$ = new Subject<boolean | void>();
  thumbnailsPanelOpened$ = this.toggleThumbnailsPanel$.pipe(
    scan((currentState: boolean, val: boolean | undefined) => val === undefined ? !currentState : val, false),
    startWith(false),
  );

  viscollButton = true; //AppConfig.evtSettings.ui.viscollButton;
  toggleViscollPanel$ = new Subject<boolean | void>();
  viscollPanelOpened$ = this.toggleViscollPanel$.pipe(
    scan((currentState: boolean, val: boolean | undefined) => val === undefined ? !currentState : val, false),
    startWith(false),
  );

  navigationDisabled$ = combineLatest([this.thumbnailsPanelOpened$, this.viscollPanelOpened$]).pipe(
    map(([thumbnailsPanelOpened, viscollPanelOpened]) => thumbnailsPanelOpened || viscollPanelOpened),
  );

  prevNavigationDisabled$ = combineLatest([
    this.navigationDisabled$,
    this.currentPageIndex$,
  ]).pipe(
    map(([navDisabled, currentIndex]) => navDisabled || currentIndex === 0),
  );

    pagesAvailable$ = this.showSinglePage$.pipe(
        distinctUntilChanged(),
        switchMap((single) => single ? this.evtModelService.pages$ : this.evtModelService.imageDoublePages$),
    ) ;

  nextNavigationDisabled$ = combineLatest([
    this.navigationDisabled$,
    this.currentPageIndex$,
  ]).pipe(
    withLatestFrom(this.pagesAvailable$),
    map(([[navDisabled, currentIndex], pages]) => navDisabled || currentIndex === pages?.length - 1),
  );

  pageSliderOptions$ = combineLatest([this.navigationDisabled$, this.pagesAvailable$])
    .pipe(
      map(([navigationDisabled, pages]) => ({
        floor: 0,
        ceil: pages?.length - 1,
        showSelectionBar: true,
        translate: (value: number): string => pages ? pages[value]?.label ?? '' : '',
        disabled: navigationDisabled ?? false,
      })),
    );

  @HostListener('window:resize') resize() {
    this.updateThContainerInfo$.next();
  }

  constructor(
    public evtStatusService: EVTStatusService,
    public evtModelService: EVTModelService,
  ) {}

  onUpdatePage(page:number) :void {
      this.changeIndexPage.emit(page);
  }

  onGoLastPage():void {
      this.pagesAvailable$.pipe(
        first(),
      ).subscribe(
        (pages) => {
            this.changeIndexPage.emit(pages.length-1);
        },
      )
  }
}
