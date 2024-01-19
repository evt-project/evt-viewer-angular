import { Component } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { map, shareReplay, withLatestFrom } from 'rxjs/operators';
import { AppConfig } from '../../app.config';
import { Page, XMLImagesValues } from '../../models/evt-models';
import { ViewerSource } from '../../models/evt-polymorphic-models';
import { EVTModelService } from '../../services/evt-model.service';
import { EVTStatusService } from '../../services/evt-status.service';

@Component({
  selector: 'evt-image-image',
  templateUrl: './image-image.component.html',
  styleUrls: ['./image-image.component.scss'],
})
export class ImageImageComponent {

  public layoutOptions: GridsterConfig = {
    gridType: GridType.Fit,
    displayGrid: DisplayGrid.None,
    margin: 0,
    minCols: 2,
    maxCols: 4,
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
  public imagePanelItem: GridsterItem[] = [{ cols: 1, rows: 1, y: 0, x: 0 },{ cols: 1, rows: 1, y: 0, x: 1 }];
  public imageViewer$ = this.evtModelService.surfaces$.pipe(
    withLatestFrom(this.evtModelService.pages$),
    map(([surface, pages]) => {
      const editionImages = AppConfig.evtSettings.files.editionImagesSource;
      console.log(editionImages);
      for (const key of Object.keys(editionImages)) {
        if (editionImages[key].enable) {
          return ViewerSource.getDataType(key, surface);
        }
      }

      return {
        type: 'default',
        value: {
          xmlImages: pages.map((page) => ({ url: page.facsUrl })) as XMLImagesValues[],
        },
      };
    }),
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

  addImage() {
    if (this.imagePanelItem.length + 1 <= this.layoutOptions.maxCols) {
      this.imagePanelItem.push({ cols: 1, rows: 1, y: 0, x: this.imagePanelItem.length });
    }
  }

  removeImage() {
    this.imagePanelItem.pop();
  }

}
