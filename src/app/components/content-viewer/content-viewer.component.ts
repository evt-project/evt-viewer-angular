import { Component, ComponentRef, Input, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';

import { AttributesMap } from 'ng-dynamic-component';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { GenericElementData } from 'src/app/models/parsed-elements';
import { ComponentRegisterService, register } from '../../services/component-register.service';

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

  contentChange = new BehaviorSubject<GenericElementData>(undefined);
  @ViewChild('container', { read: ViewContainerRef, static: false }) container: ViewContainerRef;

  constructor(
    private componentRegister: ComponentRegisterService,
  ) {
  }
  // tslint:disable-next-line: no-any
  public parsedContent: Observable<{ [keyName: string]: any }> = this.contentChange.pipe(
    map((data) => ({
      ...data,
      type: this.componentRegister.getComponent(data.type),
    })),
    shareReplay(1),
  );

  // tslint:disable-next-line: no-any
  public inputs: Observable<{ [keyName: string]: any }> = this.contentChange.pipe(
    map((data) => ({ data })),
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

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
  }
}
