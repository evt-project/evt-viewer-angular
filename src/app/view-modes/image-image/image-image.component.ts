import { Component, OnInit } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';

@Component({
  selector: 'evt-image-image',
  templateUrl: './image-image.component.html',
  styleUrls: ['./image-image.component.scss'],
})
export class ImageImageComponent implements OnInit {
  public layoutOptions: GridsterConfig = {};
  public imagePanel1Item: GridsterItem = { cols: 1, rows: 1, y: 0, x: 0 };
  public imagePanel2Item: GridsterItem = { cols: 1, rows: 1, y: 0, x: 1 };

  ngOnInit() {
    this.initGridster();
  }

  private initGridster() {
    this.layoutOptions = {
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
