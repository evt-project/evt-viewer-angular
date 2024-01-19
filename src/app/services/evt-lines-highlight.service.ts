import { Injectable } from '@angular/core';
import { BehaviorSubject,    filter,    map, withLatestFrom } from 'rxjs';
import { EVTModelService } from './evt-model.service';
import { EVTStatusService } from './evt-status.service';

@Injectable({ providedIn: 'root' })
export class EvtLinesHighlightService {
  private parsedContent: any;
  constructor(private evtModelService: EVTModelService, private evtStatusService: EVTStatusService  ){
    this.evtStatusService.currentPage$.subscribe((page)=>{
      this.clearHighlightText();
      this.lineBeginningSelected$.next([]);
      this.parsedContent = page.parsedContent;
      if (page){
        setTimeout(()=>{
        page.parsedContent.forEach((pc)=>{
          this.assignLbId(pc)
        })
        }, 500);
      }
    })
    this.lineBeginningSelected$.pipe(
      filter(()=> this.syncTextImage$.value)
    ).subscribe((lines) => {
      if (lines.length > 0) {
        this.highlightLineText(
          lines.map((z)=> ({ id: z.corresp, selected: z.selected })),
                    );
      } else {
        this.clearHighlightText();
      }
    });
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

  private tempLbId = '';
  private tempCorrespId = '';

  private assignLbId(startingContent: any): void{
    if (startingContent.type.name === 'Lb'){
      this.tempLbId = startingContent.facs.replace('#', '');
      this.tempCorrespId = startingContent.id.replace('#', '');

      return;
    }
    startingContent.lbId = this.tempLbId;
    startingContent.correspId = this.tempCorrespId;
    if (startingContent.content !== undefined) {
      for (const insideContent of startingContent.content) {
        this.assignLbId(insideContent);
      }
    }

  }

  clearHighlightText():void {
    if (this.parsedContent === undefined){
      return;
    }
    for (const pc of this.parsedContent) {
      this.recursiveHighlight(pc, [{ id: 'empty', selected: false }]);
    }
  }

  highlightLineText(lbIds: Array<{id: string, selected: boolean}>) {
    if (!lbIds || lbIds.length === 0) {
      return;
    }

    for (const pc of this.parsedContent) {
      this.recursiveHighlight(pc, lbIds);
    }
  }

  private recursiveHighlight( pc: any, lbIds: Array<{id: string, selected: boolean}>): void{
    if ( pc.type.name !== 'Verse' && pc.type.name !== 'Paragraph'  && pc.type.name !== 'Word' ){
      const f = lbIds.find( (lbId) => pc.correspId === lbId.id);
      if (f){
        if (f.selected){
          pc.class= ' highlightverse selected';
        } else{
          pc.class= ' highlightverse';
        }
      } else{
        pc.class =  '';
      }
    }

    if (pc.content){
      for (const insidePc of pc.content) {
      this.recursiveHighlight(insidePc, lbIds);
      }
    }
  }
}
