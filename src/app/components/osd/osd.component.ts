import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BehaviorSubject, combineLatest, Observable, of, Subject, Subscription  } from 'rxjs';
import { combineLatestWith, distinctUntilChanged, filter, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Page, Point, Surface, ViewerDataType } from '../../models/evt-models';
import { OsdTileSource, ViewerDataInput, ViewerSource } from '../../models/evt-polymorphic-models';
import { uuid } from '../../utils/js-utils';
import { EvtLinesHighlightService } from 'src/app/services/evt-lines-highlight.service';
import { EVTModelService } from '../../services/evt-model.service';

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
  addHandler: (eventName: string, handler: (x: { page?: number, position: {} }) => void) => void;
  goToPage: (page: number) => void;
  viewport;
  gestureSettingsMouse;
  container;
  raiseEvent: (evtName: string) => void;
  forceRedraw: ()=> void;
  destroy: ()=> void;
  canvasOverlay: ({})=> OpenSeaDragonOverlay;
}

interface OpenSeaDragonOverlay{
  canvas: ()=> HTMLCanvasElement;
  context2d: () => CanvasRenderingContext2D;
}

@Component({
  selector: 'evt-osd',
  templateUrl: './osd.component.html',
  styleUrls: ['./osd.component.scss'],
})
export class OsdComponent implements AfterViewInit, OnDestroy {

  @ViewChild('osd', { read: ElementRef, static: true }) div: ElementRef;
    private unsubscribeAll$ = new Subject<void>();

  @Input() surface: Surface | undefined;
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
    try {

      this._viewerSource = ViewerSource.getSource(v, v.type);
      this.sourceChange.next(this._viewerSource);
    }catch{

    }
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
  overlay: OpenSeaDragonOverlay;
  annotationsHandle: OsdAnnotationAPI;

  private subscriptions: Subscription[] = [];

  tileSources: Observable<OsdTileSource[]>;

  @Input() sync: boolean;

  private lineSelected: Array<{
    id: string; corresp: string;
    // ul: { x: number; y: number; },
    // lr: { x: number; y: number; },
    coords: Point[],
    selected: boolean | undefined
  }> = [];
  mouseMoved$ = new Subject<{ x: number; y: number; }>();
  mouseClicked$ = new Subject<{ x: number; y: number; }>();

  constructor(
    private http: HttpClient, private linesHighlightService: EvtLinesHighlightService,
    private evtModelService: EVTModelService,
  ) {
    this.subscriptions.push(
      this.pageChange.pipe(
        distinctUntilChanged(),
      ).subscribe((x) => this.viewer?.goToPage(x - 1)),
    );
  }

  private isPointInsidePolygon(coords: Point[], x: number, y: number): boolean {
    let intersections = 0;

    for (let i = 0; i < coords.length; i++) {
        const p1 = coords[i];
        const p2 = coords[(i + 1) % coords.length];

        if ((p1.y > y) !== (p2.y > y) &&
            x < ((p2.x - p1.x) * (y - p1.y)) / (p2.y - p1.y) + p1.x) {
            intersections++;
        }
    }

    return intersections % 2 === 1;
}

  ngAfterViewInit() {
    this.viewerId = uuid('openseadragon');
    this.div.nativeElement.id = this.viewerId;

    try{
    this.tileSources = ViewerSource.getTileSource(this.sourceChange, this._viewerDataType, this.http);
    } catch{
      this.tileSources=of([]);
    }
    const commonOptions = {
      visibilityRatio: 0.66,
      minZoomLevel: 0.3,
      maxZoomLevel: 1,
      defaultZoomLevel: 1,
      sequenceMode: true,
      prefixUrl: 'assets/osd/images/',
      id: this.div.nativeElement.id,
      navigatorBackground: '#606060',
      showNavigator: true,
      gestureSettingsMouse: {
        clickToZoom: false,
        dblClickToZoom: true,
      },
      aspectRatio: 0.66,
      placeholderFillStyle: 'assets/images/empty-image.jpg',
    };

    this.subscriptions.push(combineLatest([this.optionsChange, this.tileSources, this.evtModelService.pages$])
      .subscribe(([_, tileSources, pages]) => {

        if (this.viewer){
          this.viewer.destroy();
          this.viewer = undefined;
        }
        console.log('init');

        if (!!tileSources) {
          //TODO: controllare questo, solo per test
          if (tileSources.length === 0){

           const tiles = pages.map((p) =>( {
                type: 'image',
                url: p.facsUrl,
               //  protocol: 'http',
               //  height: '',
               // '@id': p.id,
               //  '@context': p.id,
               //  width: '',
               //  profile: [],


              } as OsdTileSource));

           console.log('tiles:', tiles);
              this.viewer = OpenSeadragon({
                ...commonOptions,
                ...this.options,
                tileSources: tiles,
              });


          } else{
            this.viewer = OpenSeadragon({
              ...commonOptions,
              ...this.options,
              tileSources,
            });
          }
        } else {

          this.viewer = OpenSeadragon({
            ...commonOptions,
           ...this.options,
          });
        }
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
        this.viewer.addHandler('canvas-click', (canvasClickEvent) => {
            const webPoint = canvasClickEvent.position;
              const viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);
              const imagePoint = this.viewer.viewport.viewportToImageCoordinates(viewportPoint);
              this.mouseClicked$.next({ x: imagePoint.x, y: imagePoint.y });
        });
        this.viewer.addHandler('open', () => {
          const tracker = new OpenSeadragon.MouseTracker({
            element: this.viewer.container,
            moveHandler: (event) => {
              const webPoint = event.position;
              const viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);
              const imagePoint = this.viewer.viewport.viewportToImageCoordinates(viewportPoint);
              this.mouseMoved$.next({ x: imagePoint.x, y: imagePoint.y });
            },
          });
          tracker.setTracking(true);
        });

        if (this.surface?.zones?.lines?.length > 0){
          this.mouseMoved$.pipe(
              combineLatestWith(this.linesHighlightService.syncTextImage$.asObservable()),
              filter(([_mm, isSync])=> isSync),
              distinctUntilChanged(),
              takeUntil(this.unsubscribeAll$),
          ).subscribe(([imagePoint]) => {
            const linesOver = this.surface.zones.lines.filter((line) => this.isPointInsidePolygon(line.coords,imagePoint.x,imagePoint.y ));

            const elementsSelected = this.linesHighlightService.lineBeginningSelected$.getValue().filter( (e) => e.selected);

            const linesOverMapped =  linesOver.filter((lo)=> !elementsSelected.some((es) => es.corresp === lo.corresp)  ).map((lo) => ({
              id: lo.corresp,
              corresp: lo.corresp,
              selected: undefined,
            }));
            this.linesHighlightService.lineBeginningSelected$.next([
              ...elementsSelected, ...linesOverMapped,
            ]);

          });

          this.mouseClicked$.pipe(
              combineLatestWith(this.linesHighlightService.syncTextImage$.asObservable()),
              filter(([_mm, isSync])=> isSync),
              distinctUntilChanged(),
              takeUntil(this.unsubscribeAll$),
          ).subscribe(([imagePoint]) => {

            const linesOver = this.surface.zones.lines.filter((line) => {

              const ulPoint = line.coords[0];
              const lrPoint = line.coords[2];

              return imagePoint.x > ulPoint.x &&
                  imagePoint.x < lrPoint.x &&
                  imagePoint.y > ulPoint.y &&
                  imagePoint.y < lrPoint.y;
            });

            let elementsSelected = this.linesHighlightService.lineBeginningSelected$.getValue().filter( (e) => e.selected);

            linesOver.forEach((lo)=>{
              if (elementsSelected.some((es) => es.corresp === lo.corresp)){
                elementsSelected = elementsSelected.filter((es) => es.corresp !== lo.corresp)
              } else{
                elementsSelected.push({
                  id: lo.corresp,
                  corresp: lo.corresp,
                  selected: true,
                });
              }
            });
            this.linesHighlightService.lineBeginningSelected$.next(elementsSelected);
          });
        }

        if (!this.surface){
          return;
        }
        const originalImageWidth = +this.surface.graphics[0].width.replace('px','');
        const originalImageHeight = +this.surface.graphics[0].height.replace('px','');
        const aspectRatio = originalImageHeight / originalImageWidth;

        this.linesHighlightService.zonesHighlights$.pipe(
          distinctUntilChanged((a, b) => JSON.stringify(a.map((ae) => ae.id)) === JSON.stringify(b.map((be) => be.id))),
          withLatestFrom(this.linesHighlightService.syncTextImage$),
          filter(([_zones, sync])=> sync),
          takeUntil(this.unsubscribeAll$),
        ).subscribe(([zones]) => {
          this.lineSelected = zones ?? [];
          if (zones?.length > 0) {
              this.linesHighlightService.highlightLineText(
                            zones.map((z)=> ({ id: z.corresp, selected: z.selected })),
                          );
          } else {
            this.linesHighlightService.clearHighlightText();
          }
          this.viewer.forceRedraw();
        });

        this.overlay = this.viewer.canvasOverlay({
          onRedraw: () => {
            for (const lineSelected of this.lineSelected) {
              const context2d = this.overlay.context2d();
              context2d.beginPath();
              context2d.moveTo(
                (lineSelected.coords[0].x /originalImageWidth),
                (lineSelected.coords[0].y / originalImageHeight) * aspectRatio);
              for (let i = 1; i < lineSelected.coords.length; i++) {
                context2d.lineTo(
                  (lineSelected.coords[i].x/originalImageWidth),
                  (lineSelected.coords[i].y/ originalImageHeight)* aspectRatio,
                  );
              }
              context2d.closePath();
              context2d.fillStyle = lineSelected.selected ? '#aaaa19' : '#d36019';
              context2d.globalAlpha = 0.2;
              context2d.strokeStyle = 'black';
              context2d.fill();
            }
          },
          clearBeforeRedraw: true,
        });
        //}
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.linesHighlightService.clearHighlightText();
    this.unsubscribeAll$.next();
    this.unsubscribeAll$.complete();

  }
}
