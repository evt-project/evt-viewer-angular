import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
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

  constructor(
    private evtStatusService: EVTStatusService,
    private evtModelService: EVTModelService,
  ) {
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
}
