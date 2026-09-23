import { Component } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { map, shareReplay } from 'rxjs/operators';
import { EditionLevel } from '../../app.config';
import { Page } from '../../models/evt-models';
import { EVTModelService } from '../../services/evt-model.service';
import { EVTStatusService } from '../../services/evt-status.service';

@Component({
  selector: 'evt-image-text',
  templateUrl: './image-text.component.html',
  styleUrls: ['./image-text.component.scss'],
})
export class ImageTextComponent {
  public layoutOptions: GridsterConfig = {
    gridType: GridType.Fit,
    displayGrid: DisplayGrid.None,
    margin: 0,
    maxCols: 2,
    maxRows: 1,
    draggable: {
      enabled: true,
      ignoreContent: true,
      dragHandleClass: 'panel-header',
      ignoreContentClass: 'no-drag'
    },
    resizable: {
      enabled: false,
    },
  };
  public imagePanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 0 };
  public textPanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 1 };
  public imageViewer$ = this.evtModelService.imageViewer$;
  public currentPageID$ = this.evtStatusService.currentStatus$.pipe(
    map(({ page }) => page.id),
  );

  public currentEditionLevel$ = this.evtStatusService.currentStatus$.pipe(
    map(({ editionLevels }) => editionLevels[0]),
    shareReplay(1),
  );

  constructor(
    private evtStatusService: EVTStatusService,
    private evtModelService: EVTModelService,
  ) {
  }

  changePage(selectedPage: Page) {
    this.evtStatusService.updatePage$.next(selectedPage);
  }

  changeEditionLevel(editionLevel: EditionLevel) {
    this.evtStatusService.updateEditionLevels$.next([editionLevel?.id]);
  }
}
