import { Component, OnDestroy, Input, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';

import { AttributesMap } from 'ng-dynamic-component';
import { register } from '../../services/component-register.service';
import { Subject, Observable, combineLatest } from 'rxjs';
import { map, shareReplay, filter } from 'rxjs/operators';
import { GenericElementData } from 'src/app/models/parsed-elements';

@Component({
  selector: 'evt-content-viewer',
  templateUrl: './content-viewer.component.html',
})
@register
export class ContentViewerComponent implements OnDestroy {
  private v: GenericElementData;
  @Input() set content(v: GenericElementData) {
    this.v = v;
    this.contentChange.next(v);
  }
  get content() { return this.v; }

  contentChange = new Subject<GenericElementData>();
  @ViewChild('container', { read: ViewContainerRef, static: false }) container: ViewContainerRef;

  public parsedContent: Observable<{ [keyName: string]: any }> = this.contentChange.pipe(
    shareReplay(1),
  );

  public inputs: Observable<{ [keyName: string]: any }> = this.contentChange.pipe(
    map((x) => ({ data: x })),
    shareReplay(1),
  );
  // tslint:disable-next-line: ban-types
  public outputs: Observable<{ [keyName: string]: Function }> = this.contentChange.pipe(
    map(() => ({})),
    shareReplay(1),
  );
  public attributes: Observable<AttributesMap> = this.contentChange.pipe(
    filter(parsedContent => !!parsedContent),
    map((parsedContent) => ({ ...parsedContent.attributes || {}, ...{ class: parsedContent.class || '' } })),
    shareReplay(1),
  );

  public context$ = combineLatest([
    this.parsedContent,
    this.inputs,
    this.outputs,
    this.attributes,
  ]).pipe(
    map(([parsedContent, inputs, outputs, attributes]) => (
      { parsedContent, inputs, outputs, attributes }
    )),
  );


  private componentRef: ComponentRef<{}>;

  constructor(
  ) {
    this.context$.subscribe();
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
