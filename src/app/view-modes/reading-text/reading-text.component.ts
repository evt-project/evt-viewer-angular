import { Component, OnInit, OnDestroy } from '@angular/core';
import { GridsterConfig, GridType, DisplayGrid, GridsterItem, CompactType } from 'angular-gridster2';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { register } from '../../services/component-register.service';
import { PageData } from '../../models/evt-models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'evt-reading-text',
  templateUrl: './reading-text.component.html',
  styleUrls: ['./reading-text.component.scss']
})
@register
export class ReadingTextComponent implements OnInit, OnDestroy {
  public layoutOptions: GridsterConfig = {};
  public textPanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 0 };
  public currentPage = this.route.params.pipe(
    map((params) => params.page),
  );
  public options: GridsterConfig = {};

  public apparatusesOpened = true;
  public apparatusesItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 1 };

  public pinnedBoardOpened = false;
  public pinnedBoardItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 1 };

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

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
        enabled: false
      },
      resizable: {
        enabled: false
      },
    };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
