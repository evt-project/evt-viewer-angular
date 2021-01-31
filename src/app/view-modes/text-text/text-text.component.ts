import { Component, OnDestroy, OnInit } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Page } from 'src/app/models/evt-models';
import { EVTStatusService } from 'src/app/services/evt-status.service';

import { EditionLevel } from '../../app.config';

@Component({
  selector: 'evt-text-text',
  templateUrl: './text-text.component.html',
  styleUrls: ['./text-text.component.scss'],
})
export class TextTextComponent implements OnInit, OnDestroy {
  public options: GridsterConfig = {};
  public textPanel1Item: GridsterItem = { cols: 1, rows: 1, y: 0, x: 0 };
  public textPanel2Item: GridsterItem = { cols: 1, rows: 1, y: 0, x: 1 };

  public currentPageID$ = this.evtStatusService.currentStatus$.pipe(
    map(({ page }) => page.id),
  );

  public currentEditionLevels$ = this.evtStatusService.currentStatus$.pipe(
    map(({ editionLevels }) => editionLevels),
    shareReplay(1),
  );

  private editionLevelPanel1Change$: BehaviorSubject<EditionLevel> = new BehaviorSubject(undefined);
  private editionLevelPanel2Change$: BehaviorSubject<EditionLevel> = new BehaviorSubject(undefined);
  private lastPanelChanged$: BehaviorSubject<1 | 2> = new BehaviorSubject(undefined);

  public editionLevelChange$ = combineLatest([
    this.editionLevelPanel1Change$,
    this.editionLevelPanel2Change$,
    this.lastPanelChanged$,
  ]);

  private subscriptions: Subscription[] = [];

  constructor(
    private evtStatusService: EVTStatusService,
  ) {
  }

  ngOnInit() {
    this.initGridster();
    this.editionLevelChange$.subscribe(([edLvl1, edLvl2, changedPanel]) => {
      if (!edLvl1 || !edLvl2) { return; }
      if (edLvl1 === edLvl2) {
        if (changedPanel === 1) {
          edLvl2 = this.evtStatusService.availableEditionLevels.filter(e => e.id !== edLvl1.id)[0];
        } else if (changedPanel === 2) {
          edLvl1 = this.evtStatusService.availableEditionLevels.filter(e => e.id !== edLvl2.id)[0];
        }
      }
      this.evtStatusService.updateEditionLevels$.next([edLvl1?.id, edLvl2?.id]);
    });
  }

  changePage(selectedPage: Page) {
    this.evtStatusService.updatePage$.next(selectedPage);
  }

  changeEditionLevel(edLvl: EditionLevel, changedPanel: 1 | 2) {
    if (changedPanel === 1) {
      this.editionLevelPanel1Change$.next(edLvl);
    } else if (changedPanel === 2) {
      this.editionLevelPanel2Change$.next(edLvl);
    }
    this.lastPanelChanged$.next(changedPanel);
  }

  private initGridster() {
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.None,
      margin: 0,
      maxCols: 2,
      maxRows: 1,
      draggable: {
        enabled: true,
        ignoreContent: true,
        dragHandleClass: 'panel-header',
      },
      resizable: {
        enabled: false,
      },
    };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
