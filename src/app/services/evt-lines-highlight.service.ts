import { Injectable } from '@angular/core';
import { BehaviorSubject,    filter,    map, withLatestFrom } from 'rxjs';
import { EVTModelService } from './evt-model.service';
import { EVTStatusService } from './evt-status.service';
import { Lb, Paragraph, Verse, Word } from '../models/evt-models';

@Injectable({ providedIn: 'root' })
export class EvtLinesHighlightService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parsedContent: any;
  constructor(private evtModelService: EVTModelService, private evtStatusService: EVTStatusService  ){
    this.evtStatusService.currentPage$.subscribe((page)=>{
      this.clearHighlightText();
      this.lineBeginningSelected$.next([]);
      this.parsedContent = page.parsedContent;
      if (page){
        setTimeout(()=>{
        page.parsedContent?.forEach((pc)=>{
          this.assignLbId(pc, false)
        })
        }, 500);
      }
    })
    this.lineBeginningSelected$.pipe(
      filter(()=> this.syncTextImage$.value),
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
      const linesOver = surface?.zones?.lines.filter((line) => lbS.some((l) => l.id === line.id || l.id === line.corresp)) ?? [];

      return  linesOver.map((lo) => ({
            id: lo.id,
            corresp: lo.corresp,
            // ul: { x: lo.coords[0].x, y: lo.coords[0].y },
            // lr: { x: lo.coords[2].x, y: lo.coords[2].y },
            coords: lo.coords,
            selected: lbS.find((l)=>l.corresp === lo.corresp)?.selected,
          }));
    }),
  );

  private tempLbId = '';
  private tempCorrespId = '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private assignLbId(startingContent: any, ignoreFindLbElement: boolean): void{
    if (startingContent.type.name === Verse.name && startingContent.attributes['facs']){
      const facsId = startingContent.attributes['facs'].replace('#', '');
      const id = startingContent.attributes['id'];

      this.tempLbId = facsId;
      this.tempCorrespId = id;

      startingContent.lbId = this.tempLbId;
      startingContent.correspId = this.tempCorrespId;

      for (const insideContent of startingContent.content) {
        this.assignLbId(insideContent, true);
      }
      this.tempLbId = '';
      this.tempCorrespId = '';

      return;
    }

    if (startingContent.type.name === Lb.name && !ignoreFindLbElement){
      this.tempLbId = startingContent.facs?.replace('#', '');
      this.tempCorrespId = startingContent.id?.replace('#', '');

      return;
    }
    startingContent.lbId = this.tempLbId;
    startingContent.correspId = this.tempCorrespId;
    if (startingContent.content !== undefined) {
      for (const insideContent of startingContent.content) {
        this.assignLbId(insideContent, ignoreFindLbElement);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recursiveHighlight( pc: any, lbIds: Array<{id: string, selected: boolean}>): void{
    if ( pc.type.name !== Verse.name  && pc.type.name !== Paragraph.name  && pc.type.name !== Word.name ){
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
