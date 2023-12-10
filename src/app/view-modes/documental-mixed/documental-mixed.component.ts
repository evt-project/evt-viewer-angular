import { Component, OnDestroy, OnInit } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { map, withLatestFrom } from 'rxjs/operators';
import { AppConfig } from '../../app.config';
import { Page, XMLImagesValues } from '../../models/evt-models';
import { ViewerSource } from '../../models/evt-polymorphic-models';
import { EVTModelService } from '../../services/evt-model.service';
import { EVTStatusService } from '../../services/evt-status.service';

@Component({
  selector: 'evt-documental-mixed',
  templateUrl: './documental-mixed.component.html',
  styleUrls: ['./documental-mixed.component.scss'],
})
export class DocumentalMixedComponent implements OnInit, OnDestroy {
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
    },
    resizable: {
      enabled: false,
    },
  };
  public imagePanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 0 };
  public textPanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 1 };

  public imageViewer$ = this.evtModelService.surfaces$.pipe(
    withLatestFrom(this.evtModelService.pages$),
    map(([surface, pages]) => {
      const editionImages = AppConfig.evtSettings.files.editionImagesSource;
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

  public currentPageID$ = this.evtStatusService.currentStatus$.pipe(
    map(({ page }) => page.id),
  );

  constructor(
    private evtStatusService: EVTStatusService,
    private evtModelService: EVTModelService,
  ) {
  }

  changePage(selectedPage: Page) {
    this.evtStatusService.updatePage$.next(selectedPage);
  }

  changeLayer(selectedLayer: string) {
    this.evtStatusService.updateLayer$.next(selectedLayer);
  }

  ngOnInit(): void {
    this.evtStatusService.updateEditionLevels$.next(['changes']);
  }

  ngOnDestroy(): void {
    this.evtStatusService.updateEditionLevels$.next(['critical']);
  }


}
