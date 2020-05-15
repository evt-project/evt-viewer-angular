import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { AppConfig, EditionLevelType } from '../../app.config';
import { EditionLevelService } from '../../services/edition-level.service';

@Component({
  selector: 'evt-text-sources',
  templateUrl: './text-sources.component.html',
  styleUrls: ['./text-sources.component.scss'],
})
export class TextSourcesComponent implements OnInit {
  public options: GridsterConfig = {};
  public textPanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 0 };
  public sourcesPanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 1 };

  private defaultEditionLevel = AppConfig.evtSettings.edition.availableEditionLevels?.filter((e => !e.disabled))[0];
  public currentEditionLevel = this.route.params.pipe(
    map((params) => params.edLvl ?? this.defaultEditionLevel?.id),
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

  handleEditionLevelChange(editionLevel: EditionLevelType) {
    this.editionLevel.handleEditionLevelChange(this.route, editionLevel, 'edLvl');
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
