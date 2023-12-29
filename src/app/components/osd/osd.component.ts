import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Page, Surface, ViewerDataType } from '../../models/evt-models';
import { OsdTileSource, ViewerDataInput, ViewerSource } from '../../models/evt-polymorphic-models';
import { uuid } from '../../utils/js-utils';

// eslint-disable-next-line no-var
declare var OpenSeadragon;

interface OsdAnnotation {
  id: string;
  element: HTMLElement;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  text: string;
  modalService?: NgbModal;
}

interface OsdAnnotationAPI {
  elements: OsdAnnotation[];
  getElements: () => OsdAnnotation[];
  getElementById: (id: string) => OsdAnnotation;
  addElement: (e: OsdAnnotation) => OsdAnnotation[];
  addElements: (es: OsdAnnotation[]) => OsdAnnotation[];
  removeElementById: (id: string) => void;
  removeElementsById: (ids: string[]) => void;
  goToElementLocation: (id: string) => void;
}

interface OsdViewerAPI {
  addHandler: (eventName: string, handler: (x: { page: number }) => void) => void;
  goToPage: (page: number) => void;
  viewport;
  gestureSettingsMouse;
  raiseEvent: (evtName: string) => void;
}
/*
Observable<OsdTileSource[]>
  "@id": "https://www.e-codices.unifr.ch:443/loris/bge/bge-gr0044/bge-gr0044_e001.jp2/full/full/0/default.jpg",
  "@type": "dctypes:Image",
  "format": "image/jpeg",
  "height": 7304,
  "width": 5472,
  "service": {
    "@context": "http://iiif.io/api/image/2/context.json",
    "@id": "https://www.e-codices.unifr.ch/loris/bge/bge-gr0044/bge-gr0044_e001.jp2",
    "profile": "http://iiif.io/api/image/2/level2.json"
  }
}

To:
{
  '@context': 'http://iiif.io/api/image/2/context.json',
  '@id': 'https://www.e-codices.unifr.ch/loris/bge/bge-gr0044/bge-gr0044_e001.jp2',
  'profile': ['http://iiif.io/api/image/2/level2.json'],
  'protocol': 'http://iiif.io/api/image',
  'height': 7304,
  'width': 5472,
}
*/

@Component({
  selector: 'evt-osd',
  templateUrl: './osd.component.html',
  styleUrls: ['./osd.component.scss'],
})
export class OsdComponent implements AfterViewInit, OnDestroy {

  @ViewChild('osd', { read: ElementRef, static: true }) div: ElementRef;

  @Input() surface: Surface;
  @Input() pageElement: Page;
  // tslint:disable-next-line: variable-name
  private _options;
  @Input() set options(v) { // TODO: add interface to better type this object
    if (v !== this._options) {
      this._options = v;
      this.optionsChange.next(this._options);
    }
  }
  get options() { return this._options; }
  optionsChange = new BehaviorSubject({});

  private _viewerDataType: string; // tslint:disable-line: variable-name
  public _viewerSource: ViewerDataInput; // tslint:disable-line: variable-name
  @Input() set viewerData(v: ViewerDataType) {
    this._viewerDataType = v.type;
    this._viewerSource = ViewerSource.getSource(v, v.type);
    this.sourceChange.next(this._viewerSource);
  }
  sourceChange = new BehaviorSubject<ViewerDataInput>([]);

  // tslint:disable-next-line: variable-name
  private _page: number;
  @Input() set page(v: number) {
    if (v !== this._page) {
      this._page = v;
      this.viewer?.goToPage(v);
    }
  }

  get page() { return this._page; }

  @Output() pageChange = new EventEmitter<number>();

  @Input() text: string;

  viewer: Partial<OsdViewerAPI>;
  viewerId: string;
  overlay: any;
  annotationsHandle: OsdAnnotationAPI;

  private subscriptions: Subscription[] = [];

  tileSources: Observable<OsdTileSource[]>;

  constructor(
    private http: HttpClient,

  ) {
    this.subscriptions.push(
      this.pageChange.pipe(
        distinctUntilChanged(),
      ).subscribe((x) => this.viewer?.goToPage(x - 1)),
    );
  }

  lineSelected = new BehaviorSubject<{id: string; corresp: string; ul: {x: number; y:number;}, lr:{x: number; y:number;} }[]>([]);
  mouseMoved$ = new Subject<{x: number; y:number;}>();

  ngAfterViewInit() {
    this.viewerId = uuid('openseadragon');
    this.div.nativeElement.id = this.viewerId;
    this.tileSources = ViewerSource.getTileSource(this.sourceChange, this._viewerDataType, this.http);

    const commonOptions = {
      visibilityRatio: 0.66,
      minZoomLevel: 0.5,
      defaultZoomLevel: 1,
      sequenceMode: true,
      prefixUrl: 'assets/osd/images/',
      id: this.div.nativeElement.id,
      navigatorBackground: '#606060',
      showNavigator: false,
      gestureSettingsMouse: {
        clickToZoom: false,
        dblClickToZoom: true,
      },
      aspectRatio: 0.66,
      placeholderFillStyle: 'assets/images/empty-image.jpg',
    };

    this.subscriptions.push(combineLatest([this.optionsChange, this.tileSources])
      .subscribe(([_, tileSources]) => {
        if (!!tileSources) {
          this.viewer = OpenSeadragon({
            ...commonOptions,
            ...this.options,
            tileSources,
          });
        } else {
          this.viewer = OpenSeadragon({
            ...commonOptions,
            ...this.options,
          });
        }

        console.log(this.surface);
        // console.log("Qui ci arriva: ",this.viewer);
        this.viewer.goToPage(this.page);
        this.viewer.addHandler('page', ({ page }) => {
          this.pageChange.next(page + 1);
        });
        this.viewer.addHandler('open-failed', () => {
          const canvasEl: HTMLCanvasElement = this.div?.nativeElement?.querySelector('.openseadragon-canvas canvas');
          if (canvasEl) {
            const context = canvasEl.getContext('2d');
            context.clearRect(0, 0, canvasEl.width, canvasEl.height);
          }
        });
          this.viewer.addHandler('open', ()=> {
            // console.log("opened",this.viewer,this.viewer?.container);
          const tracker = new OpenSeadragon.MouseTracker({
              element: (this.viewer as any).container,
              moveHandler: (event) => {
                  const webPoint = event.position;
                  const viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);
                  const imagePoint = this.viewer.viewport.viewportToImageCoordinates(viewportPoint);
                  this.mouseMoved$.next({ x: imagePoint.x, y: imagePoint.y } );

              },
          });
          tracker.setTracking(true);
        });

        this.mouseMoved$.pipe(
          //debounceTime(50),
          distinctUntilChanged(),
        ).subscribe((imagePoint)=>{
          // const zoom = this.viewer.viewport.getZoom(true);
          //console.log(imagePoint);

          const linesOver = this.surface.zones.lines.filter((line)=>{
            //debugger;
            const ulPoint =line.coords[0];
            const lrPoint = line.coords[2];

            return imagePoint.x > ulPoint.x &&
              imagePoint.x < lrPoint.x &&
              imagePoint.y > ulPoint.y &&
              imagePoint.y < lrPoint.y;
          });

          this.lineSelected.next(linesOver.map((lo) =>({
            id: lo.id,
            corresp: lo.corresp,
            ul: { x: lo.coords[0].x, y: lo.coords[0].y },
            lr: { x: lo.coords[2].x, y: lo.coords[2].y },
          })));
        });

        const originalImageHeight = 1800;
        const originalImageWidth = 1200;
        const aspectRatio = 1.5;

        const thicknessx = 2/originalImageWidth;
        const thicknessy = 2/originalImageHeight;
        this.lineSelected.pipe(
          distinctUntilChanged((a,b)=> JSON.stringify(a.map((ae)=>ae.id)) === JSON.stringify(b.map((be)=>be.id))),
        ).subscribe((zones)=>{
          console.log('new lines', zones[0]);
          this.clearHighlightLineText();
          if (zones.length > 0){
            this.highlightLineText(
                zones[0].corresp,
              );
            }
           (this.viewer as any).forceRedraw();
        });

        this.overlay = (this.viewer as any).canvasOverlay({
          onRedraw: ()=> {
              //console.log('lines selected', this.lineSelected.value.length);
              for(const lineSelected of this.lineSelected.value){
                const context2d = this.overlay.context2d();
                //const lrx = 1031, lry = 610, ulx = 257, uly = 558;
                const lrx = lineSelected.lr.x, lry = lineSelected.lr.y, ulx = lineSelected.ul.x, uly = lineSelected.ul.y;
                // <zone corresp="#VB_lb_104v_08" lrx="1108" lry="560" rend="visible" rendition="Line" ulx="273" uly="510"

                context2d.fillStyle = '#d36019';
                context2d.globalAlpha = 0.2;
                context2d.strokeStyle = 'black';
                context2d.fillRect(
                  ulx/originalImageWidth - thicknessx ,
                  (uly/originalImageHeight)*aspectRatio - thicknessy,
                  (lrx-ulx)/originalImageWidth + (thicknessx * 2),
                  ((lry-uly)/originalImageHeight)*aspectRatio+ (thicknessy * 2),
                );
                context2d.stroke();

                context2d.fillStyle = '#d36019';
                context2d.globalAlpha = 0.2;
                context2d.strokeStyle = 'black';
                context2d.fillRect(
                  ulx/originalImageWidth,
                  (uly/originalImageHeight)*aspectRatio,
                  (lrx-ulx)/originalImageWidth ,
                  ((lry-uly)/originalImageHeight)*aspectRatio,
                  );
                context2d.stroke();

                // context2d.fillStyle = 'blue';
                // context2d.strokeStyle = 'red';
                // //var fillRect = false;
                // context2d.rect(
                //   ulx/originalImageWidth,
                //  (uly/originalImageHeight)*aspectRatio,
                //   (lrx-ulx)/originalImageWidth ,
                //    ((lry-uly)/originalImageHeight)*aspectRatio,
                //    );
                // //if (fillRect) {
                //   context2d.fill();
                // // }
                // context2d.stroke();


                // // if (this.viewer && this.viewer.viewport) {
                // //   const rect = this.viewer.viewport.imageToViewportRectangle(ulx, uly, (lrx-ulx), (lry-uly));
                //   console.log('ppppppppp');
                // //   overlay.context2d().fillRect(rect.x, rect.y, rect.width,rect.height);   
                // // }
              }
          },
          clearBeforeRedraw: true,
      });
      }));
  }

  private clearHighlightLineText(){
    for(const pe of this.pageElement.parsedContent){
      if ((pe as any).content && (pe as any).content.length > 0){
        for(const content of (pe as any).content){
          (content as any).class = ''; //content.class?.replace('highlightverse', '');
           this.clearHighlightInside(content);
        }
        //
      } else{
        this.clearHighlightInside(pe);
        //(pe as any).content.class='';//?.replace('highlightverse', '');
      }

      (pe as any).class='';//?.replace('highlightverse', '');
    }
  }

  private clearHighlightInside(content: any){
    let isWord = false;
    if (content.text === ' treow'){
      // debugger;
      console.log('clear sub content', content.text, content)
      isWord = true;
    }
    if (content.content ){
      for(const insideContent of content.content){
        if (isWord){
          console.log( '--> ', insideContent);
        }
        if (insideContent.content){
        this.clearHighlightInside(insideContent)
        }
        insideContent.class = '';
      }
    }

    content.class = '';
  }

  private highlightLineText(lbId: string){
    if (!lbId || lbId === ''){
      return;
    }
    console.log('find lbid', lbId);
    // const parsedContentFromIdx = this.pageElement.parsedContent
    //   .findIndex((pc: any) => pc.content?.some((pc_c) => pc_c.type.name === 'Lb' && pc_c.id === lbId));

    const parsedContentFromIdx = this.findLbId(this.pageElement.parsedContent,lbId);

      //PER PAOLO, creare funzione cerca Lb con id ma ritornare l'indice del primo livello
      //Fatta la funzione che ritorna l'indice di primo livello del content che a sua volta
      //contiene un Lb in un suo content child di qualunque livello
      //Ora bisogna capire come utilizzare questo indice per evidenziare tutti gli elementi
      //compresi tra l'Lb con indice secondario e il successivo Lb
    console.log('parsedContentFromIdx' , parsedContentFromIdx);
    //let contentElementFromIdx: number;
    if (parsedContentFromIdx < 0){ return;}
    // const parsedContentOfIdx: any = this.pageElement.parsedContent[parsedContentFromIdx];
    // contentElementFromIdx = this.findLbId(parsedContentOfIdx,lbId);
    // if (contentElementFromIdx < 0 && parsedContentOfIdx.content ){
    //   contentElementFromIdx = this.findLbId(parsedContentOfIdx.content,lbId)
    // }
   // contentElementFromIdx = 0;
   // contentElementFromIdx = this.findLbId((this.pageElement.parsedContent[parsedContentFromIdx] as any).content,lbId);

    // contentElementFromIdx = (this.pageElement.parsedContent[parsedContentFromIdx] as any)
    //   .content?.findIndex(((pcC) => pcC.type.name === 'Lb' && pcC.id === lbId)) ??0;

   // console.log('contentElementFromIdx' , contentElementFromIdx);

    //let startingParsedContentFromIdx = parsedContentFromIdx;
    // debugger;
    // let startFoundLb = false;


    //const pcStart: any = this.pageElement.parsedContent[parsedContentFromIdx];
    


    let result = {hasFoundStartLb: false, hasFoundEndLb: false };
    for(let pcIdx = parsedContentFromIdx; pcIdx < this.pageElement.parsedContent.length; pcIdx++){
      const pc: any = this.pageElement.parsedContent[pcIdx];
      result = this.highlightContent2(0,pc, lbId, result.hasFoundStartLb, result.hasFoundEndLb);
      if (result.hasFoundStartLb && result.hasFoundEndLb){
        break;
      }
    }
    // this.highlightContent(pcStart, lbId, false);
/*
    for(let pcIdx = parsedContentFromIdx; pcIdx < this.pageElement.parsedContent.length; pcIdx++){
      const pc: any = this.pageElement.parsedContent[pcIdx];

      if (!pc.content || pc.content.length === 0) {
        pc.class = ' highlightverse';
        continue;
      }
     let foundLb = false;
      // if (pc.type === 'word'){
      //   console.log('WORD', pc);
      // }
      console.log('TYPE', pc);

      for(let contentIdx = 0; contentIdx < pc.content.length; contentIdx++){
        const content = pc.content[contentIdx];
        // content.text = 'a';
        foundLb = this.highlightContent(content, lbId, true);
        if (foundLb){
          // foundLb = true;
          // startFoundLb = true;
          // contentElementFromIdx = -1;
          break;
        }
        

        // if (!content.type){
        //   content.class =' highlightverse';
        //   console.log('NOT TYPE', content);
        //   continue;
        // }
        // if (content.type.name === 'Lb' && content.id !== lbId){
        //   foundLb = true;
        //   contentElementFromIdx = -1;
        //   break;
        // }
        // content.class = ' highlightverse';
      }
      // if (pcIdx !== parsedContentFromIdx && !foundLb){
      //   pc.class = ' highlightverse';
      // }
      // if (contentElementFromIdx < 0){
      //   break;
      // }
      // contentElementFromIdx = 0;
    }
*/

    //console.log('parsed indexes', parsedContentFromIdx, contentElementFromIdx);
  }

  //private foundStartLbId: boolean = false;

  

  
  private highlightContent2(profondita: number, startingContent: any, lbId: string,
        hasFoundStartLb: boolean, 
        hasFoundEndLb: boolean ): 
      {hasFoundStartLb: boolean, hasFoundEndLb: boolean } {
//Devo trovare lbId di partenza e ritorno quando lo trovo
    if (!hasFoundStartLb){
      if (startingContent.type.name === 'Lb' &&  startingContent.id === lbId ){
        return { hasFoundStartLb: true, hasFoundEndLb: false };
      }

      if (startingContent.content !== undefined){
        for(const insideContent of startingContent.content){
          const result = this.highlightContent2(profondita+1, insideContent, lbId, 
            hasFoundStartLb,
            hasFoundEndLb);

            
          hasFoundStartLb = result.hasFoundStartLb;
          hasFoundEndLb = result.hasFoundEndLb;
          
         if (hasFoundStartLb && hasFoundEndLb){ 
          break;
         }
         if (hasFoundStartLb && insideContent.content === undefined){
          insideContent.class = ' highlightverse';
          console.log('Evidenziando not found start lb', insideContent.text);
         }
          // if ((devoEvidenziare || this.foundStartLbId) && insideContent.id !== lbId ){
          //   insideContent.class = ' highlightverse';
          // }
        }

        return {hasFoundStartLb, hasFoundEndLb};
      }

    }

   
    //Devo trovare lbId di fine e ritorno quando lo trovo
    if (hasFoundStartLb) {
      if (startingContent.content !== undefined){
        for(const insideContent of startingContent.content){
          // if (insideContent.type.name === 'Lb'){
          //   return {hasFoundStartLb: true, hasFoundEndLb: true}; 
          // }
          const result = this.highlightContent2(profondita+1, insideContent, lbId, hasFoundStartLb,hasFoundEndLb );
          if (result.hasFoundEndLb){
            return  {hasFoundStartLb: true, hasFoundEndLb: true}; 
          }
          insideContent.class = ' highlightverse';
          return  {hasFoundStartLb: true, hasFoundEndLb: true}; 
        }
      } else if (startingContent.type.name === 'Lb'){
        
        return {hasFoundStartLb: true, hasFoundEndLb: true}; 
      }  else  {
        console.log('Evidenziando found lb', startingContent.text);
        startingContent.class = ' highlightverse';
        return {hasFoundStartLb: true, hasFoundEndLb: false};
      }
    }
    return {hasFoundStartLb: false, hasFoundEndLb: false};
  }
  

/*
  //Questo ritorna se ha trovato il starting Found LbId
  private highlightContent(startingContent: any, startLbId: string, hasAlreadyFoundStartLbId: boolean) : boolean{
    // console.log('typeinside', content.type.name);
    // if (content.type.name === 'Word'){
    //   console.log('WORD ', content);
    // }
    //Non ha ancora trovato l'elemento di partenza, deve trovare il primo elemento
    if (startingContent.type.name === 'Lb' && startingContent.id === startLbId && !hasAlreadyFoundStartLbId){
      console.log('FOUND LB', startingContent);

      return true;
    }
    //Ho già trovato il primo elemento devo trovare il successivo
    if (startingContent.type.name === 'Lb' && startingContent.id !== startLbId && hasAlreadyFoundStartLbId){
      return false;
    }
    if (startingContent.content !== undefined){
      //  console.log('WORD Has content', content);
      for(const insideContent of startingContent.content){
        if (insideContent.type.name === 'Lb' && startLbId === insideContent.id){
          return true;
        }
        if (hasAlreadyFoundStartLbId){
          insideContent.class = ' highlightverse';
        }
        
        hasAlreadyFoundStartLbId = this.highlightContent(insideContent, startLbId, hasAlreadyFoundStartLbId);
      }
    }

    return false;
  }*/

  private findLbId(pc:any, lbId: string):number{

    // const parsedContentFromIdx = this.pageElement.parsedContent
    //   .findIndex((pc: any) => pc.content?.some((pc_c) => pc_c.type.name === 'Lb' && pc_c.id === lbId));
    const lbFoundId: number = pc.findIndex((pc1) => pc1.content?.some((pc2) => pc2.type.name === 'Lb' && pc2.id === lbId));
    if (lbFoundId > -1) {
      return lbFoundId;
    }
    // debugger;
    console.log('Non ho trovato LB quindi cerco dentro i content del content che sto esaminando');
    for(let i = 0; i < pc.length; i++){
      if (pc[i].content !== undefined){
        if (this.findLbId(pc[i].content,lbId) > -1) {
          // debugger;
          console.log('ho trovato i', i);

          return i;
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
