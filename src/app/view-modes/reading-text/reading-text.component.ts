import { Component, OnInit } from '@angular/core';
import { GridsterConfig, GridType, DisplayGrid, GridsterItem } from 'angular-gridster2';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-reading-text',
  templateUrl: './reading-text.component.html',
  styleUrls: ['./reading-text.component.scss']
})
@register
export class ReadingTextComponent implements OnInit {
  public layoutOptions: GridsterConfig = {};
  public textPanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 0 };

  constructor() { }

  ngOnInit() {
    this.initGridster();
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
}
