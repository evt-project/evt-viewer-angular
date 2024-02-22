import { Component } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { map,  withLatestFrom } from 'rxjs/operators';
import { AppConfig } from '../../app.config';
import { Page,  XMLImagesValues } from '../../models/evt-models';
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
  // public pageDouble = this.evtModelService.surfacesGrp$.pipe(
  //   map((sGrps)=>{
  //     return sGrps.map((_sGrp, index)=>{
  //       const pNew: Page = {
  //         url:'',
  //         id: index.toString(),
  //         facs:'',
  //         facsUrl:'',
  //         label: index.toString(),
  //         originalContent:[],
  //         parsedContent:[],
  //       };
  //       return pNew;
  //     })
  //
  //   }),
  // );

  public imageViewer$ = this.evtModelService.surfacesGrp$.pipe(
    withLatestFrom(this.evtModelService.surfacesGrpPages$),
    map(([surfacesGrp, _pageDouble]) => {
      const editionImages = AppConfig.evtSettings.files.editionImagesSource;
      console.log(editionImages);
      // for (const key of Object.keys(editionImages)) {
      //   if (editionImages[key].enable) {
      //     const surface: Surface={
      //       zones:[],
      //       id:
      //     };
      //     const surfaces: Surface[]=[surface]
      //     return ViewerSource.getDataType(key, surfaces);
      //   }
      // }

      // return {
      //   type: 'default',
      //   value: {
      //     xmlImages: pageDouble.map((page) => ({ url: page.facsUrl })) as XMLImagesValues[],
      //   },
      // };
      const result: XMLImagesValues[] = surfacesGrp.map(sGrp=>{

        const fileName = sGrp.surfaces.reduce((pv, cv)=>{
          if (pv.length === 0){
            return pv+cv.corresp.replace('#', '');
          }
          return pv+'-'+cv.corresp.replace('#', '');

        }, '');

        const imagesFolderUrl = AppConfig.evtSettings.files.imagesFolderUrls.double;
        const url = `${imagesFolderUrl}${fileName}.jpg`;
        const r: XMLImagesValues ={
          url: url,
          width: 910,
          height: 720,
        };
        return r;
      });
      return  {
        type: 'default',
         value: {
          xmlImages:result,
         },
       };
    }),
  );

  public currentPageID$ = this.evtModelService.surfacesGrpPages$.pipe(
      map((surfacesGrpPages) => {
        const sGrp = surfacesGrpPages[0];
        return sGrp.id;
      }),
  );

  
  
  
  

  constructor(
    private evtStatusService: EVTStatusService,
    private evtModelService: EVTModelService,
  ) {
  }

  changePage(selectedPage: Page) {
    this.evtStatusService.updatePage$.next(selectedPage);
  }

  // changeEditionLevel(editionLevel: EditionLevel) {
  //   this.evtStatusService.updateEditionLevels$.next([editionLevel?.id]);
  // }
}
