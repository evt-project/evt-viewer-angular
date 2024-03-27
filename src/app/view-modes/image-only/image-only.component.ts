import { Component } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { map } from 'rxjs/operators';
import { Page } from '../../models/evt-models';
import { EVTModelService } from '../../services/evt-model.service';
import { EVTStatusService } from '../../services/evt-status.service';

@Component({
  selector: 'evt-image-only',
  templateUrl: './image-only.component.html',
  styleUrls: ['./image-only.component.scss'],
})
export class ImageOnlyComponent {
  public layoutOptions: GridsterConfig = {
    gridType: GridType.Fit,
    displayGrid: DisplayGrid.None,
    margin: 0,
    maxCols: 1,
    maxRows: 1,
    draggable: {
      enabled: false,
      ignoreContent: true,
      dragHandleClass: 'panel-header',
    },
    resizable: {
      enabled: false,
    },
  };
  public imagePanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 0 };
  public imageViewer$ = this.evtModelService.imageDouble$;
  public currentPageID$ = this.evtModelService.imageDoublePages$.pipe(
    map((surfacesGrpPages) => {
        if (surfacesGrpPages && surfacesGrpPages.length > 0){
          const sGrp = surfacesGrpPages[0];

          return sGrp.id;
        }

        return '';
    }),
  );

  constructor(
    private evtStatusService: EVTStatusService,
    private evtModelService: EVTModelService,
  ) {}

  changePage(selectedPage: Page) {
    this.evtStatusService.updatePage$.next(selectedPage);
  }
}
