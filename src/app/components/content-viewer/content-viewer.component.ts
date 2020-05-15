import { Component, ComponentRef, Input, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';

import { AttributesMap } from 'ng-dynamic-component';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { GenericElementData } from 'src/app/models/parsed-elements';
import { EntitiesSelectService } from 'src/app/services/entities-select.service';
import { ComponentRegisterService } from '../../services/component-register.service';
import { EntitiesSelectItem } from '../entities-select/entities-select.component';

@Component({
  selector: 'evt-content-viewer',
  templateUrl: './content-viewer.component.html',
})
export class ContentViewerComponent implements OnDestroy {
  private v: GenericElementData;
  @Input() set content(v: GenericElementData) {
    this.v = v;
    this.contentChange.next(v);
  }
  get content() { return this.v; }

  private ith: EntitiesSelectItem[];
  @Input() set itemsToHighlight(i: EntitiesSelectItem[]) {
    this.ith = i;
    this.itemsToHighlightChange.next(i);
  }
  get itemsToHighlight() { return this.ith; }

  contentChange = new BehaviorSubject<GenericElementData>(undefined);
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
  itemsToHighlightChange = new BehaviorSubject<EntitiesSelectItem[]>([]);

  constructor(
    private componentRegister: ComponentRegisterService,
    private entitiesSelectService: EntitiesSelectService,
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
  public inputs: Observable<{ [keyName: string]: any }> = combineLatest([
    this.contentChange,
    this.itemsToHighlightChange,
  ]).pipe(
    map(([data, ith]) => {
      if (this.toBeHighlighted()) {
        return {
          data,
          highlightData: this.getHighlightData(data, ith),
          itemsToHighlight: ith,
        };
      }

      return { data };
    }),
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

  private toBeHighlighted() {
    return true; // TODO: Decide when an item should be highlighted
  }

  private getHighlightData(data, ith: EntitiesSelectItem[]) {
    return {
      highlight: ith?.some(i => this.entitiesSelectService.matchClassAndAttributes(i.value, data.attributes, data.class)) ?? false,
      highlightColor: this.entitiesSelectService.getHighlightColor(data.attributes, data.class, ith),
    };
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
  }
}
