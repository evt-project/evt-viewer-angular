import { Component, ComponentRef, Input, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';

import { AttributesMap } from 'ng-dynamic-component';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { EditionLevelType, TextFlow } from '../../app.config';
import { GenericElement } from '../../models/evt-models';
import { ComponentRegisterService } from '../../services/component-register.service';
import { EntitiesSelectService } from '../../services/entities-select.service';
import { EntitiesSelectItem } from '../entities-select/entities-select.component';

@Component({
  selector: 'evt-content-viewer',
  templateUrl: './content-viewer.component.html',
})
export class ContentViewerComponent implements OnDestroy {
  private v: GenericElement;
  @Input() set content(v: GenericElement) {
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

  contentChange = new BehaviorSubject<GenericElement>(undefined);
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
  itemsToHighlightChange = new BehaviorSubject<EntitiesSelectItem[]>([]);

  private edLevel: EditionLevelType;
  @Input() set editionLevel(el: EditionLevelType) {
    this.edLevel = el;
    this.editionLevelChange.next(el);
  }
  get editionLevel() { return this.edLevel; }
  editionLevelChange = new BehaviorSubject<EditionLevelType | ''>('');

  private txtFlow: TextFlow;
  @Input() set textFlow(t: TextFlow) {
    this.txtFlow = t;
    this.textFlowChange.next(t);
  }
  get textFlow() { return this.txtFlow; }
  textFlowChange = new BehaviorSubject<TextFlow>(undefined);

  private withDels: boolean;
  @Input() set withDeletions(d: boolean) {
    this.withDels = d;
    this.withDeletionsChange.next(d);
  }
  get withDeletions() { return this.withDels; }
  withDeletionsChange = new BehaviorSubject<boolean>(true);

  constructor(
    private componentRegister: ComponentRegisterService,
    private entitiesSelectService: EntitiesSelectService,
  ) {
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public parsedContent: Observable<{ [keyName: string]: any }> = this.contentChange.pipe(
    map((data) => ({
      ...data,
      type: this.componentRegister.getComponent(data?.type ?? GenericElement) || this.componentRegister.getComponent(GenericElement),
    })),
    shareReplay(1),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public inputs: Observable<{ [keyName: string]: any }> = combineLatest([
    this.contentChange,
    this.itemsToHighlightChange,
    this.editionLevelChange,
    this.textFlowChange,
    this.withDeletionsChange,
  ]).pipe(
    map(([data, itemsToHighlight, editionLevel, textFlow, withDeletions]) => {
      if (this.toBeHighlighted()) {
        return {
          data,
          highlightData: this.getHighlightData(data, itemsToHighlight),
          itemsToHighlight,
          editionLevel,
          textFlow,
          withDeletions,
        };
      }

      return {
        data,
        editionLevel,
        textFlow,
        withDeletions,
      };
    }),
    shareReplay(1),
  );

  // tslint:disable-next-line: ban-types
  public outputs: Observable<{ [keyName: string]: Function }> = this.contentChange.pipe(
    map(() => ({})),
    shareReplay(1),
  );
  public attributes: Observable<AttributesMap> = this.contentChange.pipe(
    filter((parsedContent) => !!parsedContent),
    map((parsedContent) => ({ ...parsedContent.attributes || {}, ...{ class: `edition-font ${parsedContent.class || ''}` } })),
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
      highlight: ith?.some((i) => this.entitiesSelectService.matchClassAndAttributes(i.value, data?.attributes ?? {}, data?.class)) ?? false,
      highlightColor: this.entitiesSelectService.getHighlightColor(data?.attributes ?? {}, data?.class, ith),
    };
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
  }
}
