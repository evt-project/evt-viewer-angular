import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { delay, filter, first, map, scan, startWith, withLatestFrom } from 'rxjs/operators';
// import { AppConfig } from '../app.config';
import { EVTModelService } from '../services/evt-model.service';
// import { EVTStatusService } from '../services/evt-status.service';

@Component({
  selector: 'evt-nav-bar-image',
  templateUrl: './nav-bar-image.component.html',
  styleUrls: ['./nav-bar-image.component.scss'],
})
export class NavBarImageComponent {

  @Input() set currentIndexPage(value:number | null){
    if (value){
      this.currentPageIndex$.next(value);
      console.log('Nuovo index', value);

    }
  };

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

  nextNavigationDisabled$ = combineLatest([
    this.navigationDisabled$,
    this.currentPageIndex$,
  ]).pipe(
    withLatestFrom(this.evtModelService.pages$),
    map(([[navDisabled, currentIndex], pages]) => navDisabled || currentIndex === pages.length - 1),
  );

  pageSliderOptions$ = combineLatest([this.navigationDisabled$, this.evtModelService.pages$])
    .pipe(
      map(([navigationDisabled, pages]) => ({
        floor: 0,
        ceil: pages.length - 1,
        showSelectionBar: true,
        translate: (value: number): string => pages[value]?.label ?? '',
        disabled: navigationDisabled,
      })),
    );

  @HostListener('window:resize') resize() {
    this.updateThContainerInfo$.next();
  }

  constructor(
    // public evtStatusService: EVTStatusService,
    public evtModelService: EVTModelService,
  ) {
  }

  toggleThumbnailsPanel() {
    this.toggleThumbnailsPanel$.next();
    this.toggleViscollPanel$.next(false);
  }

  toggleViscollPanel() {
    this.toggleViscollPanel$.next();
    this.toggleThumbnailsPanel$.next(false);
  }

  onUpdatePage(page:number) :void {
    this.currentPageIndex$.next(page);
    this.changeIndexPage.emit(this.currentPageIndex$.value);
  }

  onGoLastPage():void {
    this.evtModelService.pages$.pipe(
        first(),
      ).subscribe(
        (pages) => {
          this.currentPageIndex$.next(pages.length-1);
          this.changeIndexPage.emit(this.currentPageIndex$.value);
        }
      )
    }
}
