import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { AppConfig, EditionLevelType } from '../../app.config';
import { PageData } from '../../models/evt-models';
import { EditionLevelService } from '../../services/edition-level.service';

@Component({
  selector: 'evt-reading-text',
  templateUrl: './reading-text.component.html',
  styleUrls: ['./reading-text.component.scss'],
})
export class ReadingTextComponent implements OnInit, OnDestroy {
  public layoutOptions: GridsterConfig = {};
  public textPanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 0 };
  public currentPage = this.route.params.pipe(
    map((params) => params.page),
  );
  private defaultEditionLevel = AppConfig.evtSettings.edition.availableEditionLevels?.filter((e => !e.disabled))[0];
  public currentEditionLevel = this.route.params.pipe(
    map((params) => params.edLvl ?? this.defaultEditionLevel?.id),
    distinctUntilChanged((x, y) => x === y),
  );
  public options: GridsterConfig = {};

  public apparatusesOpened = true;
  public apparatusesItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 1 };

  public pinnedBoardOpened = false;
  public pinnedBoardItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 1 };

  private subscriptions: Subscription[] = [];

  constructor(
    private editionLevel: EditionLevelService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.initGridster();
  }

  handlePageChange(selectedPage: PageData) {
    if (selectedPage) {
      const viewMode = this.route.snapshot.routeConfig.path;
      const params = { ...this.route.snapshot.params };
      if (params.page !== selectedPage.id) {
        params.page = selectedPage.id;
        this.router.navigate(['/' + viewMode, params]);
      }
    }
  }

  handleEditionLevelChange(editionLevel: EditionLevelType) {
    this.editionLevel.handleEditionLevelChange(this.route, editionLevel, 'edLvl');
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
