import { Component } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';

@Component({
  selector: 'evt-image-image',
  templateUrl: './image-image.component.html',
  styleUrls: ['./image-image.component.scss'],
})
export class ImageImageComponent {
  // tslint:disable-next-line: max-line-length
  public layoutOptions: GridsterConfig = { gridType: GridType.Fit, displayGrid: DisplayGrid.None, margin: 0, maxCols: 2, maxRows: 1, draggable: { enabled: true, ignoreContent: true, dragHandleClass: 'panel-header'}, resizable: { enabled: false }};
  public imagePanel1Item: GridsterItem = { cols: 1, rows: 1, y: 0, x: 0 };
  public imagePanel2Item: GridsterItem = { cols: 1, rows: 1, y: 0, x: 1 };
}
