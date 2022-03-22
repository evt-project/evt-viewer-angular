import { Component, OnInit } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { map, shareReplay } from 'rxjs/operators';
import { AppConfig, EditionLevel } from '../../app.config';
import { Page, Surface, ViewerDataType, XMLImagesValues } from '../../models/evt-models';
import { ViewerSource } from '../../models/evt-polymorphic-models';
import { EVTModelService } from '../../services/evt-model.service';
import { EVTStatusService } from '../../services/evt-status.service';

@Component({
  selector: 'evt-image-text',
  templateUrl: './image-text.component.html',
  styleUrls: ['./image-text.component.scss'],
})
export class ImageTextComponent implements OnInit {
  public layoutOptions: GridsterConfig = {};
  public imagePanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 0 };
  public textPanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 1 };

  public imageViewer$ = this.evtModelService.surfaces$.pipe(
    map((surface) => this.getImageViewerType(AppConfig.evtSettings.files.editionImagesSource, surface)),
  );

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

  getImageViewerType(editionImages, surface: Surface[]): ViewerDataType {
    for (const key of Object.keys(editionImages)) {
      if (editionImages[key].enabled) {
        return ViewerSource.getDataType(key, surface);
      }
    }
    const xmlImages: XMLImagesValues[] = [];
    this.evtModelService.pages$.pipe().subscribe(
      (pages) => pages.map(page => xmlImages.push({ url: page.facsUrl }),
      ));

    return { type: 'default', value: { xmlImages } };
  }

  ngOnInit() {
    this.initGridster();
  }

  changePage(selectedPage: Page) {
    this.evtStatusService.updatePage$.next(selectedPage);
  }

  changeEditionLevel(editionLevel: EditionLevel) {
    this.evtStatusService.updateEditionLevels$.next([editionLevel?.id]);
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
