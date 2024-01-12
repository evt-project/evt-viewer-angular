import { Injectable } from '@angular/core';
import { BehaviorSubject,  map, withLatestFrom } from 'rxjs';
import { EVTModelService } from './evt-model.service';
import { EVTStatusService } from './evt-status.service';

@Injectable({providedIn: 'root'})
export class EvtLinesHighlightService {
  constructor(private evtModelService: EVTModelService, private evtStatusService: EVTStatusService  ){

  }

  public syncTextImage$ = new BehaviorSubject<boolean>(false);

  lineBeginningSelected$ = new BehaviorSubject<Array<{ id: string; corresp: string; }>>([]);

  currentSurfaces$ = this.evtStatusService.currentPage$.pipe(
    withLatestFrom(this.evtModelService.surfaces$),
    map(([cp, surfaces]) => {
      console.log('elenco surfaces' , surfaces);

      return surfaces.find((surface) => surface.corresp === cp.id);
    }),
  );

  zonesHighlights$ = this.lineBeginningSelected$.pipe(
    // tap((_)=> {
    //   console.log('zonessss');
    // }),
    // distinctUntilChanged((a, b) => JSON.stringify(a.map((ae) => ae.id)) === JSON.stringify(b.map((be) => be.id))),
    withLatestFrom(this.currentSurfaces$),
    map(([lbS, surface]) =>{
      // cp.id
      // console.log('FOUNDING LINES ', lbS, surface.zones.lines);
      const linesOver = surface.zones.lines.filter((line) => lbS.some((l) => l.id === line.id));
      //console.log('linesOver ', linesOver.length);

      return  linesOver.map((lo) => ({
            id: lo.id,
            corresp: lo.corresp,
            ul: { x: lo.coords[0].x, y: lo.coords[0].y },
            lr: { x: lo.coords[2].x, y: lo.coords[2].y },
          }));
    }),
  );
}
