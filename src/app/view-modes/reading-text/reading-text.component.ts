import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { EVTStatusService } from 'src/app/services/evt-status.service';
import { EditionLevel } from '../../app.config';
import { Page } from '../../models/evt-models';

@Component({
  selector: 'evt-reading-text',
  templateUrl: './reading-text.component.html',
  styleUrls: ['./reading-text.component.scss'],
})
export class ReadingTextComponent implements OnInit, OnDestroy {
  public layoutOptions: GridsterConfig = {};
  public textPanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 0 };
  public currentPageID$ = this.evtStatusService.currentStatus$.pipe(
    map(({ page }) => page.id),
  );

  public currentEditionLevel$ = this.evtStatusService.currentStatus$.pipe(
    map(({ editionLevels }) => editionLevels[0]),
    shareReplay(1),
  );
  public options: GridsterConfig = {};

  public apparatusesOpened = true;
  public apparatusesItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 1 };

  public pinnedBoardOpened = false;
  public pinnedBoardItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 1 };

  private subscriptions: Subscription[] = [];

  constructor(
    private evtStatusService: EVTStatusService,
  ) {
  }

  ngOnInit() {
    this.initGridster();
  }

  changePage(selectedPage: Page) {
    this.evtStatusService.updatePage$.next(selectedPage);
  }

  changeEditionLevel(editionLevel: EditionLevel) {
    this.evtStatusService.updateEditionLevels$.next([editionLevel?.id]);
  }

  togglePinnedBoard() {
    this.pinnedBoardOpened = !this.pinnedBoardOpened;
    this.updateGridsterConfig();
  }

  toggleApparatuses() {
    this.apparatusesOpened = !this.apparatusesOpened;
    this.updateGridsterConfig();
  }

  changedOptions() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  private updateGridsterConfig() {
    this.pinnedBoardItem.x = this.apparatusesOpened ? 2 : (this.textPanelItem.x !== 0 ? 0 : 1);
    this.apparatusesItem.x = this.pinnedBoardOpened ? 2 : (this.textPanelItem.x !== 0 ? 0 : 1);
    this.changedOptions();
  }

  private initGridster() {
    this.layoutOptions = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.None,
      compactType: CompactType.CompactLeft,
      margin: 0,
      maxCols: 3,
      maxRows: 1,
      draggable: {
        enabled: false,
      },
      resizable: {
        enabled: false,
      },
    };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
