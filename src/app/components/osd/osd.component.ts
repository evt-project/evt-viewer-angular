import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { uuid } from '../../utils/js-utils';

declare let OpenSeadragon;

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
From:
{
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
const manifestResourcetoTileSource = (manifestResource) => ({
  '@context': manifestResource.service['@context'],
  '@id': manifestResource.service['@id'],
  profile: [manifestResource.service['@profile']],
  protocol: 'http://iiif.io/api/image',
  height: manifestResource.height,
  width: manifestResource.width,
});

@Component({
  selector: 'evt-osd',
  templateUrl: './osd.component.html',
  styleUrls: ['./osd.component.scss'],
})
export class OsdComponent implements AfterViewInit, OnDestroy {

  @ViewChild('osd', { read: ElementRef, static: true }) div: ElementRef;
  @Output() pageChange = new EventEmitter<number>();
  @Input() text: string;

  @Input() set options(v) { // TODO: add interface to better type this object
    if (v !== this.inner_options) {
      this.inner_options = v;
      this.optionsChange.next(this.inner_options);
    }
  }
  get options() { return this.inner_options; }
  optionsChange = new BehaviorSubject({});

  @Input() set manifestURL(v: string) {
    if (v !== this.inner_manifestURL) {
      this.inner_manifestURL = v;
      this.manifestURLChange.next(this.inner_manifestURL);
    }
  }
  get manifestURL() { return this.inner_manifestURL; }
  manifestURLChange = new BehaviorSubject(undefined);

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  @Input() set page(v: number) {
    if (v !== this.inner_page) {
      this.inner_page = v;
      this.pageChange.next(this.inner_page);
    }
  }
  get page() { return this.inner_page; }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tileSources: Observable<any[]> = this.manifestURLChange
    .pipe(
      filter((url) => !!url),
      distinctUntilChanged(),
      switchMap((url) => this.http.get<{ sequences: Partial<Array<{ canvases }>> }>(url)),
      map((manifest) => manifest // get the resource fields in the manifest json structure
        .sequences.map((seq) => seq.canvases.map((canv) => canv.images).reduce((x, y) => x.concat(y), []))
        .reduce((x, y) => x.concat(y), []).map((res) => res.resource)
        .map(manifestResourcetoTileSource),
      ),
    );

  viewer: Partial<OsdViewerAPI>;
  viewerId: string;
  annotationsHandle: OsdAnnotationAPI;

  private subscriptions: Subscription[] = [];
  private inner_options;
  private inner_page: number;
  private inner_manifestURL: string;

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
      // eslint-disable-next-line @typescript-eslint/naming-convention
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
