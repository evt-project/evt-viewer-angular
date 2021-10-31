import { ChangeContext } from '@angular-slider/ngx-slider';
import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AppConfig } from '../app.config';
import { EVTModelService } from '../services/evt-model.service';
import { EVTStatusService } from '../services/evt-status.service';

@Component({
  selector: 'evt-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  private currentPageInfo$ = combineLatest([
    this.evtModelService.pages$,
    this.evtStatusService.currentPage$,
  ]);

  prevNavigationDisabled$ = this.currentPageInfo$.pipe(
    map(([pages, page]) => pages.findIndex((p) => p.id === page.id) === 0),
  );
  nextNavigationDisabled$ = this.currentPageInfo$.pipe(
    map(([pages, page]) => pages.findIndex((p) => p.id === page.id) === pages.length - 1),
  );

  currentPage$ = this.currentPageInfo$.pipe(
    map(([pages, page]) => pages.findIndex((p) => p.id === page.id)),
  );

  pageSliderOptions$ = this.evtModelService.pages$.pipe(
    map(pages => ({
      floor: 0,
      ceil: pages.length - 1,
      showSelectionBar: true,
      translate: (value: number): string => pages[value]?.label ?? '',
    })),
  );

  thumbnailsButton = AppConfig.evtSettings.ui.thumbnailsButton;
  thumbnailsPanelOpened$ = new BehaviorSubject(false);

  viscollButton = AppConfig.evtSettings.ui.viscollButton;
  viscollPanelOpened$ = new BehaviorSubject(false);

  constructor(
    private evtStatusService: EVTStatusService,
    private evtModelService: EVTModelService,
  ) {
  }

  changePage(event: ChangeContext) {
    this.evtModelService.pages$.pipe(take(1)).subscribe(
      (pages) => this.evtStatusService.updatePage$.next(pages[event.value]),
    );
  }

  goToFirstPage() {
    this.evtModelService.pages$.pipe(take(1)).subscribe(
      (pages) => this.evtStatusService.updatePage$.next(pages[0]),
    );
  }

  goToPrevPage() {
    combineLatest([
      this.evtModelService.pages$,
      this.evtStatusService.currentPage$,
    ]).pipe(take(1)).subscribe(([pages, page]) => {
      const pageIndex = pages.findIndex((p) => p.id === page.id);
      if (pageIndex > 0) {
        this.evtStatusService.updatePage$.next(pages[pageIndex - 1]);
      }
    });
  }

  goToNextPage() {
    combineLatest([
      this.evtModelService.pages$,
      this.evtStatusService.currentPage$,
    ]).pipe(take(1)).subscribe(([pages, page]) => {
      const pageIndex = pages.findIndex((p) => p.id === page.id);
      if (pageIndex < pages.length - 1) {
        this.evtStatusService.updatePage$.next(pages[pageIndex + 1]);
      }
    });
  }

  goToLastPage() {
    this.evtModelService.pages$.pipe(take(1)).subscribe(
      (pages) => this.evtStatusService.updatePage$.next(pages[pages.length - 1]),
    );
  }

  toggleThumbnailsPanel() {
    this.thumbnailsPanelOpened$.pipe(take(1)).subscribe(opened => {
      this.thumbnailsPanelOpened$.next(!opened);
    });
    this.viscollPanelOpened$.pipe(take(1)).subscribe(opened => {
      if (opened) {
        this.viscollPanelOpened$.next(!opened);
      }
    });
  }

  toggleViscollPanel() {
    this.viscollPanelOpened$.pipe(take(1)).subscribe(opened => {
      this.viscollPanelOpened$.next(!opened);
    });
    this.thumbnailsPanelOpened$.pipe(take(1)).subscribe(opened => {
      if (opened) {
        this.thumbnailsPanelOpened$.next(!opened);
      }
    });
  }
}
