import { Component, OnInit } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { map } from 'rxjs/operators';
import { AppConfig } from '../../app.config';
import { Surface, ViewerDataType, XMLImagesValues } from '../../models/evt-models';
import { ViewerSource } from '../../models/evt-polymorphic-models';
import { EVTModelService } from '../../services/evt-model.service';

@Component({
  selector: 'evt-image-image',
  templateUrl: './image-image.component.html',
  styleUrls: ['./image-image.component.scss'],
})
export class ImageImageComponent implements OnInit {
  public layoutOptions: GridsterConfig = {};
  public imagePanel1Item: GridsterItem = { cols: 1, rows: 1, y: 0, x: 0 };
  public imagePanel2Item: GridsterItem = { cols: 1, rows: 1, y: 0, x: 1 };

  public imageViewer$ = this.evtModelService.surfaces$.pipe(
    map((surface) => this.getImageViewerType(AppConfig.evtSettings.files.editionImagesSource, surface)),
  );

  constructor(
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
