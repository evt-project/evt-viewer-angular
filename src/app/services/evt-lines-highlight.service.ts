import { Injectable } from '@angular/core';
import { BehaviorSubject,    map, withLatestFrom } from 'rxjs';
import { EVTModelService } from './evt-model.service';
import { EVTStatusService } from './evt-status.service';

@Injectable({ providedIn: 'root' })
export class EvtLinesHighlightService {
  // private parsedContent: any;
  constructor(private evtModelService: EVTModelService, private evtStatusService: EVTStatusService  ){
    // this.evtStatusService.currentPage$.subscribe((page)=>{
    //   //clearhighlight
    //   //next di synctextimage vuoto
    //   // this.parsedContent = page.parsedContent;
    //   //asseghnazione lbiD e corresp
    // })

    //sottoscrivere lineBeginningSelected$ e fare l'highlight
  }
  
  public syncTextImage$ = new BehaviorSubject<boolean>(false);

  lineBeginningSelected$ = new BehaviorSubject<Array<{ id: string; corresp: string; selected: boolean | undefined }>>([]);

  currentSurfaces$ = this.evtStatusService.currentPage$.pipe(
    withLatestFrom(this.evtModelService.surfaces$),
    map(([cp, surfaces]) => surfaces.find((surface) => surface.corresp === cp.id)),
  );

  zonesHighlights$ = this.lineBeginningSelected$.pipe(
    withLatestFrom(this.currentSurfaces$),
    map(([lbS, surface]) =>{
      const linesOver = surface.zones.lines.filter((line) => lbS.some((l) => l.id === line.id));

      return  linesOver.map((lo) => ({
            id: lo.id,
            corresp: lo.corresp,
            ul: { x: lo.coords[0].x, y: lo.coords[0].y },
            lr: { x: lo.coords[2].x, y: lo.coords[2].y },
            selected: lbS.find((l)=>l.id === lo.id && l.corresp === lo.corresp).selected,
          }));
    }),
  );
}
