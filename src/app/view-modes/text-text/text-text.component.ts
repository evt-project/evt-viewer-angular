import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { AppConfig, EditionLevel } from '../../app.config';
import { EditionLevelService } from '../../services/edition-level.service';

@Component({
  selector: 'evt-text-text',
  templateUrl: './text-text.component.html',
  styleUrls: ['./text-text.component.scss'],
})
export class TextTextComponent implements OnInit {
  public options: GridsterConfig = {};
  public textPanel1Item: GridsterItem = { cols: 1, rows: 1, y: 0, x: 0 };
  public textPanel2Item: GridsterItem = { cols: 1, rows: 1, y: 0, x: 1 };

  private defaultEdLvl1 = AppConfig.evtSettings.edition.availableEditionLevels?.filter((e => !e.disabled))[0];
  private defaultEdLvl2 = AppConfig.evtSettings.edition.availableEditionLevels?.filter((e => !e.disabled))[1];

  public currentEditionLevel = this.route.params.pipe(
    map((params) => params.edLvl ?? this.defaultEdLvl1?.id),
    distinctUntilChanged((x, y) => x === y),
  );
  public currentEdLvlPanel1 = this.route.params.pipe(
    map((params) => params.edLvl ?? this.defaultEdLvl1?.id),
    distinctUntilChanged((x, y) => x === y),
  );

  public currentEdLvlPanel2 = this.route.params.pipe(
    map((params) => params.edLvl2 ?? this.defaultEdLvl2?.id),
    distinctUntilChanged((x, y) => x === y),
  );

  constructor(
    private editionLevel: EditionLevelService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.initGridster();
  }

  handleEditionLevelChange(editionLevel: EditionLevel, paramName: string) {
    if (editionLevel) {
      this.editionLevel.handleEditionLevelChange(this.route, editionLevel.id, paramName);
    }
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
