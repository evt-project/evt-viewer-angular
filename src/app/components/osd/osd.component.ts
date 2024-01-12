import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { combineLatestWith, distinctUntilChanged, filter, withLatestFrom } from 'rxjs/operators';
import { Page, Surface, ViewerDataType } from '../../models/evt-models';
import { OsdTileSource, ViewerDataInput, ViewerSource } from '../../models/evt-polymorphic-models';
import { uuid } from '../../utils/js-utils';
import { EvtLinesHighlightService } from 'src/app/services/evt-lines-highlight.service';

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

  @Input() sync: boolean;
  // syncTextImage: boolean;

  constructor(
    private http: HttpClient, private linesHighlightService: EvtLinesHighlightService,

  ) {
    this.subscriptions.push(
      this.pageChange.pipe(
        distinctUntilChanged(),
      ).subscribe((x) => this.viewer?.goToPage(x - 1)),
    );

    setTimeout(()=>{
    this.pageElement.parsedContent.forEach((pc)=>{
      debugger;
      this.assignLbId(pc)
    })
    }, 500);

  }

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

  private lineSelected: Array<{ id: string; corresp: string; ul: { x: number; y: number; }, lr: { x: number; y: number; } }> = [];
  mouseMoved$ = new Subject<{ x: number; y: number; }>();

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

        // debugger;
        //console.log(this.surface);
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
        this.viewer.addHandler('open', () => {
          const tracker = new OpenSeadragon.MouseTracker({
            element: (this.viewer as any).container,
            moveHandler: (event) => {
              const webPoint = event.position;
              const viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);
              const imagePoint = this.viewer.viewport.viewportToImageCoordinates(viewportPoint);
              this.mouseMoved$.next({ x: imagePoint.x, y: imagePoint.y });
            },
          });
          tracker.setTracking(true);
        });

        // this.sync = this.linesHighlightService.syncTextImage$.getValue();
        //console.log('sync status', this.sync);
        //if (this.sync) {
          this.mouseMoved$.pipe(
            combineLatestWith(this.linesHighlightService.syncTextImage$.asObservable()),
            filter(([_mm, isSync])=> isSync),
            distinctUntilChanged(),
          ).subscribe(([imagePoint]) => {
          const linesOver = this.surface.zones.lines.filter((line) => {

            const ulPoint = line.coords[0];
            const lrPoint = line.coords[2];

            return imagePoint.x > ulPoint.x &&
              imagePoint.x < lrPoint.x &&
              imagePoint.y > ulPoint.y &&
              imagePoint.y < lrPoint.y;
          });

          this.linesHighlightService.lineBeginningSelected$.next(linesOver.map((lo) => ({
            id: lo.id,
            corresp: lo.corresp,

          })));

          // this.lineSelected.next(linesOver.map((lo) => ({
          //   id: lo.id,
          //   corresp: lo.corresp,
          //   ul: { x: lo.coords[0].x, y: lo.coords[0].y },
          //   lr: { x: lo.coords[2].x, y: lo.coords[2].y },
          // })));
        });


        const originalImageWidth = +this.surface.graphics[0].width.replace('px','');
        const originalImageHeight = +this.surface.graphics[0].height.replace('px','');
        const aspectRatio = originalImageHeight / originalImageWidth; //1.5;

        const thicknessx = 2 / originalImageWidth;
        const thicknessy = 2 / originalImageHeight;
        // this.linesHighlightService.lineBeginningSelected$.subscribe((res)=>{
        //   console.log('new lines', res);
        // });

        this.linesHighlightService.zonesHighlights$.pipe(
          distinctUntilChanged((a, b) => JSON.stringify(a.map((ae) => ae.id)) === JSON.stringify(b.map((be) => be.id))),
          withLatestFrom(this.linesHighlightService.syncTextImage$),
          filter(([_zones, sync])=> sync),
        ).subscribe(([zones]) => {
          console.log('new lines zones', zones[0]);
          this.lineSelected = zones;
          this.clearHighlightLineText();
          if (zones.length > 0) {
            this.highlightLineText(
              zones[0].corresp,
            );
          }
          (this.viewer as any).forceRedraw();
        });

        this.overlay = (this.viewer as any).canvasOverlay({
          onRedraw: () => {
            for (const lineSelected of this.lineSelected) {
              const context2d = this.overlay.context2d();
              const lrx = lineSelected.lr.x, lry = lineSelected.lr.y, ulx = lineSelected.ul.x, uly = lineSelected.ul.y;

              context2d.fillStyle = '#d36019';
              context2d.globalAlpha = 0.2;
              context2d.strokeStyle = 'black';
              context2d.fillRect(
                ulx / originalImageWidth - thicknessx,
                (uly / originalImageHeight) * aspectRatio - thicknessy,
                (lrx - ulx) / originalImageWidth + (thicknessx * 2),
                ((lry - uly) / originalImageHeight) * aspectRatio + (thicknessy * 2),
              );
              context2d.stroke();

              context2d.fillStyle = '#d36019';
              context2d.globalAlpha = 0.2;
              context2d.strokeStyle = 'black';
              context2d.fillRect(
                ulx / originalImageWidth,
                (uly / originalImageHeight) * aspectRatio,
                (lrx - ulx) / originalImageWidth,
                ((lry - uly) / originalImageHeight) * aspectRatio,
              );
              context2d.stroke();
            }
          },
          clearBeforeRedraw: true,
        });
        //}
      }));
  }

  private clearHighlightLineText() {
    for (const pe of this.pageElement.parsedContent) {
      if ((pe as any).content && (pe as any).content.length > 0) {
        for (const content of (pe as any).content) {
          (content as any).class = '';
          this.clearHighlightInside(content);
        }
        //
      } else {
        this.clearHighlightInside(pe);
      }

      (pe as any).class = '';
    }
  }

  private clearHighlightInside(content: any) {

    if (content.content) {
      for (const insideContent of content.content) {
        if (insideContent.content) {
          this.clearHighlightInside(insideContent)
        }
        insideContent.class = '';
      }
    }

    content.class = '';
  }

  private highlightLineText(lbId: string) {
    if (!lbId || lbId === '') {
      return;
    }

    const parsedContentFromIdx = this.findLbId(this.pageElement.parsedContent, lbId);

    // console.log('parsedContentFromIdx', parsedContentFromIdx);
    if (parsedContentFromIdx < 0) { return; }

    let result = { hasFoundStartLb: false, hasFoundEndLb: false };
    for (let pcIdx = parsedContentFromIdx; pcIdx < this.pageElement.parsedContent.length; pcIdx++) {
      const pc: any = this.pageElement.parsedContent[pcIdx];
      result = this.highlightContent(0, pc, lbId, result.hasFoundStartLb, result.hasFoundEndLb);
      if (result.hasFoundStartLb && result.hasFoundEndLb) {
        break;
      }
    }
  }

  private highlightContent(deep: number, startingContent: any, lbId: string,
    hasFoundStartLb: boolean,
    hasFoundEndLb: boolean): { hasFoundStartLb: boolean, hasFoundEndLb: boolean } {

    if (!hasFoundStartLb) {

      if (startingContent.type.name === 'Lb' && startingContent.id === lbId) {
        return { hasFoundStartLb: true, hasFoundEndLb: false };
      }
      let deepFound = -1;
      if (startingContent.content !== undefined) {
        for (const insideContent of startingContent.content) {
          const result = this.highlightContent(deep + 1, insideContent, lbId,
            hasFoundStartLb,
            hasFoundEndLb);

          if (result.hasFoundStartLb && deepFound === -1) {
            deepFound = deep;
          }

          hasFoundStartLb = result.hasFoundStartLb;
          hasFoundEndLb = result.hasFoundEndLb;

          if (hasFoundStartLb && hasFoundEndLb) {
            break;
          }
          if (hasFoundStartLb && deepFound > -1 && deepFound > deep) {
            insideContent.class = ' highlightverse';
            continue;
          }
        }
        if (hasFoundStartLb && hasFoundEndLb) {
          return { hasFoundStartLb, hasFoundEndLb };
        }
      }

      return { hasFoundStartLb, hasFoundEndLb };
    }

    if (hasFoundStartLb) {
      if (startingContent.type.name === 'Lb' && startingContent.id !== lbId) {
        return { hasFoundStartLb: true, hasFoundEndLb: true };
      }
      if (startingContent.content !== undefined) {

        for (const insideContent of startingContent.content) {

          const result = this.highlightContent(deep + 1, insideContent, lbId, hasFoundStartLb, hasFoundEndLb);
          if (result.hasFoundEndLb) {


            return { hasFoundStartLb: true, hasFoundEndLb: true };
          }
          insideContent.class = ' highlightverse';

        }
        if (!hasFoundEndLb){
        startingContent.class = ' highlightverse';
        }

        return { hasFoundStartLb, hasFoundEndLb };

      } else if (startingContent.type.name === 'Lb') {

        return { hasFoundStartLb: true, hasFoundEndLb: true };
      }

      startingContent.class = ' highlightverse';

      return { hasFoundStartLb: true, hasFoundEndLb: false };

    }

    return { hasFoundStartLb: false, hasFoundEndLb: false };
  }

  private findLbId(pc: any, lbId: string): number {

    const lbFoundId: number = pc.findIndex((pc1) => pc1.content?.some((pc2) => pc2.type.name === 'Lb' && pc2.id === lbId));
    if (lbFoundId > -1) {
      return lbFoundId;
    }
    // debugger;
    for (let i = 0; i < pc.length; i++) {
      if (pc[i].content !== undefined) {
        if (this.findLbId(pc[i].content, lbId) > -1) {
          // debugger;

          return i;
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
