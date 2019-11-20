import { Component, OnInit } from '@angular/core';
import { GridsterConfig, GridsterItem, GridType, DisplayGrid } from 'angular-gridster2';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-image-text',
  templateUrl: './image-text.component.html',
  styleUrls: ['./image-text.component.scss']
})
@register
export class ImageTextComponent implements OnInit {
  public layoutOptions: GridsterConfig = {};
  public imagePanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 0 };
  public textPanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 1 };

  constructor() { }

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
        dragHandleClass: 'panel-header'
      },
      resizable: {
        enabled: false
      }
    };
  }
}
