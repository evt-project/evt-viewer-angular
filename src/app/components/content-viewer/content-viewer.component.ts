import { ChangeDetectorRef, Component, ComponentRef, HostListener, Input, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';

import { AttributesMap } from 'ng-dynamic-component';
import { animationFrameScheduler, BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { auditTime, filter, map, shareReplay } from 'rxjs/operators';
import { EditionLevelType, TextFlow } from '../../app.config';
import { GenericElement, Paragraph, Verse } from '../../models/evt-models';
import { ComponentRegisterService } from '../../services/component-register.service';
import { EntitiesSelectService } from '../../services/entities-select.service';
import { EntitiesSelectItem } from '../entities-select/entities-select.component';
import { EvtLinesHighlightService } from 'src/app/services/evt-lines-highlight.service';
import { AdditionComponent } from '../addition/addition.component';

@Component({
  selector: 'evt-content-viewer',
  templateUrl: './content-viewer.component.html',
})
export class ContentViewerComponent implements OnDestroy {
  private _content: GenericElement;

  @Input() mouseCapture = false;

  @Input() set content(genericElement: GenericElement) {
    this._content = genericElement;
    this.contentChange.next(genericElement);
  }
  get content() { return this._content; }

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

  private selLayer: string;
  @Input() set selectedLayer(d: string) {
    this.selLayer = d;
    this.selectedLayerChange.next(d);
  }
  get selectedLayer() { return this.selLayer; }
  selectedLayerChange = new BehaviorSubject<string>(undefined);

  private lineBeginningActivated: Subscription;

  constructor(
    private componentRegister: ComponentRegisterService,
    private entitiesSelectService: EntitiesSelectService,
    private evtHighlineService: EvtLinesHighlightService,
    private cdr: ChangeDetectorRef,
  ) {
    this.lineBeginningActivated = this.evtHighlineService.highlightState$.pipe(
      // delay: 0 means next frame with no delay
      // scheduler: rendering scheduler instead of the default one like for setTimeout
      auditTime(0, animationFrameScheduler),
    ).subscribe(() => this.cdr.markForCheck());
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
    this.selectedLayerChange,
  ]).pipe(
    map(([data, itemsToHighlight, editionLevel, textFlow, withDeletions, selectedLayer]) => {
      if (this.toBeHighlighted()) {
        return {
          data,
          highlightData: this.getHighlightData(data, itemsToHighlight),
          itemsToHighlight,
          editionLevel,
          textFlow,
          withDeletions,
          selectedLayer,
        };
      }

      return {
        data,
        editionLevel,
        textFlow,
        withDeletions,
        selectedLayer,
      };
    }),
    shareReplay(1),
  );

  // tslint:disable-next-line: ban-types
  public outputs: Observable<{ [keyName: string]: Function }> = this.contentChange.pipe(
    map(() => ({})),
    shareReplay(1),
  );

  public semanticAttributes: Observable<AttributesMap> = this.contentChange.pipe(
    filter(Boolean),
    map(parsedContent => {
      const attrs = { ...(parsedContent.attributes || {}) };

      delete attrs.id;
      delete attrs.style;
      delete attrs.class;

      return attrs;
    }),
    shareReplay(1),
  );

  public context$ = combineLatest([
    this.parsedContent,
    this.inputs,
    this.outputs,
    this.semanticAttributes,
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


  @HostListener('click', ['$event'])
  mouseClick($event: any) {
    // parent component will clear selection unless propagation is stopped
    $event.stopPropagation();
    
    if (!this._content.content) {

      if (this._content.type.name === AdditionComponent.name) return;

      const lbId = (this._content as any).lbId;
      const correspId = (this._content as any).correspId;

      if (!lbId || !correspId) return;

      if (
        (this._content as any).text === '' ||
        (this._content as any).text === ' ' ||
        (this._content as any).type.name === Verse.name ||
        (this._content as any).type.name === Paragraph.name
      ) {
        return;
      }

      $event.preventDefault();
      this.evtHighlineService.setSelected({
        id: lbId,
        corresp: correspId
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @HostListener('mouseover', ['$event']) mouseOver($event: any) {
    if (this._content.type.name === AdditionComponent.name) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lbId = (this._content as any).lbId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const correspId = (this._content as any).correspId;

    if ((lbId === '' || correspId === '')) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const textComponent = (this._content as any).text;

    if (textComponent === '' || textComponent === ' ' ||
      ((this._content as GenericElement).type.name === Verse.name && !(this._content as GenericElement).attributes['facs']) ||
      (this._content as GenericElement).type.name === Paragraph.name
    ) {
      return;
    }

    $event.preventDefault();
    if ((this._content as GenericElement).type.name === Verse.name && (this._content as GenericElement).attributes['facs']) {

      const facsId = (this._content as GenericElement).attributes['facs'].replace('#', '');
      const id = (this._content as GenericElement).attributes['id'];
      this.evtHighlineService.setHovered({
        id: facsId, corresp: id
      });
    } else {
      this.evtHighlineService.setHovered({
        id: lbId, corresp: correspId
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @HostListener('mouseleave', ['$event']) mouseLeave($event: any) {
    $event.preventDefault();
    this.evtHighlineService.setHovered(null);
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }

    this.lineBeginningActivated.unsubscribe();
  }
}
