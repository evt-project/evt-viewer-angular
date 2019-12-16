import { Component, OnInit } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-text-sources',
  templateUrl: './text-sources.component.html',
  styleUrls: ['./text-sources.component.scss'],
})
@register
export class TextSourcesComponent implements OnInit {

  public options: GridsterConfig = {};
  public textPanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 0 };
  public sourcesPanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 1 };

  ngOnInit() {
    this.initGridster();
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
}
