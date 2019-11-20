import { Component, OnInit, OnDestroy } from '@angular/core';
import { GridsterConfig, GridType, DisplayGrid, GridsterItem } from 'angular-gridster2';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { register } from '../../services/component-register.service';
import { EditionStructure, PageData } from '../../models/evt-models';

@Component({
  selector: 'evt-reading-text',
  templateUrl: './reading-text.component.html',
  styleUrls: ['./reading-text.component.scss']
})
@register
export class ReadingTextComponent implements OnInit, OnDestroy {
  public layoutOptions: GridsterConfig = {};
  public textPanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 0 };
  public currentPage: PageData;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.initPage();
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

  private initPage() {
    this.subscriptions.push(
      this.route.params.subscribe((params) => this.currentPage = params.page ));
  }

  private initGridster() {
    this.layoutOptions = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.None,
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
