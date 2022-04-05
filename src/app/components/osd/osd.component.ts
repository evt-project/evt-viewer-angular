import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ViewerDataType } from '../../models/evt-models';
import { OsdTileSource, ViewerDataInput, ViewerSource } from '../../models/evt-polymorphic-models';
import { uuid } from '../../utils/js-utils';

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
      this.pageChange.next(this._page);
    }
  }

  get page() { return this._page; }

  @Output() pageChange = new EventEmitter<number>();

  @Input() text: string;

  viewer: Partial<OsdViewerAPI>;
  viewerId: string;
  annotationsHandle: OsdAnnotationAPI;

  private subscriptions: Subscription[] = [];

  tileSources: Observable<OsdTileSource[]>;

  constructor(
    private http: HttpClient,
  ) {
    this.subscriptions.push(this.pageChange.pipe(
      distinctUntilChanged(),
    ).subscribe((x) => {
      if (!!this.viewer) {
        this.viewer.goToPage(x - 1);
      }
    }));
  }

  ngAfterViewInit() {
    this.viewerId = uuid('openseadragon');
    this.div.nativeElement.id = this.viewerId;

    this.tileSources = ViewerSource.getTileSource(this.sourceChange, this._viewerDataType, this.http);

    const commonOptions = {
      visibilityRatio: 0.1,
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
    };

    this.subscriptions.push(combineLatest([this.optionsChange, this.tileSources])
      .subscribe(([_, tileSources]) => {
        if (!!tileSources) {
          this.viewer = OpenSeadragon({
            ...commonOptions,
            tileSources,
          });
        } else {
          this.viewer = OpenSeadragon({
            ...commonOptions,
            ...this.options,
          });
        }

        this.viewer.addHandler('page', ({ page }) => {
          this.pageChange.next(page + 1);
        });
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
