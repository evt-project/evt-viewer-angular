import { Component, OnDestroy, Input, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';

import { GenericParserService } from '../../services/xml-parsers/generic-parser.service';
import { AttributesMap } from 'ng-dynamic-component';
import { register } from '../../services/component-register.service';
import { Subject, Observable, combineLatest } from 'rxjs';
import { map, switchMap, shareReplay, delay } from 'rxjs/operators';

@Component({
  selector: 'evt-content-viewer',
  templateUrl: './content-viewer.component.html'
})
@register
export class ContentViewerComponent implements OnDestroy {
  @Input() set content(v: HTMLElement) {
    this.contentChange.next(v);
  }
  contentChange = new Subject<HTMLElement>();
  @ViewChild('container', { read: ViewContainerRef, static: false }) container: ViewContainerRef;
  public parsedContent = this.contentChange.pipe(
    switchMap((xml) => this.parser.parse(xml)),
    delay(0),
    shareReplay(1),
  );

  public inputs: Observable<{ [keyName: string]: any }> = this.parsedContent.pipe(
    map((x) => ({ data: x })),
    shareReplay(1),
  );
  // tslint:disable-next-line: ban-types
  public outputs: Observable<{ [keyName: string]: Function }> = this.parsedContent.pipe(
    map(() => ({})),
    shareReplay(1),
  );
  public attributes: Observable<AttributesMap> = this.parsedContent.pipe(
    map((parsedContent) => parsedContent.attributes || { class: parsedContent.class || '' }),
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
    private parser: GenericParserService,
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
