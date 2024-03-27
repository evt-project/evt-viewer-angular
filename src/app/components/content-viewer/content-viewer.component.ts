import { Component, ComponentRef, HostListener, Input, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';

import { AttributesMap } from 'ng-dynamic-component';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
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

  @Input() catturaMouse = false;

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

  constructor(
    private componentRegister: ComponentRegisterService,
    private entitiesSelectService: EntitiesSelectService,
    private evtHighlineService: EvtLinesHighlightService,
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
  ]).pipe(
    map(([data, itemsToHighlight, editionLevel, textFlow]) => {
      if (this.toBeHighlighted()) {
        return {
          data,
          highlightData: this.getHighlightData(data, itemsToHighlight),
          itemsToHighlight,
          editionLevel,
          textFlow,
        };
      }

      return {
        data,
        editionLevel,
        textFlow,
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  @HostListener('click',['$event']) mouseClick($event: any) {

    if (!this._content.content){

      if (this._content.type.name === AdditionComponent.name){
          return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lbId = (this._content as any).lbId;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const correspId =  (this._content as any).correspId;

      if ((lbId === '' || correspId === '')){
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((this._content as any).text === '' || (this._content as any).text === ' ' ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (this._content as any).type.name === Verse.name ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (this._content as any).type.name === Paragraph.name
          ){
        return;
      }

      const elementsSelected = this.evtHighlineService.lineBeginningSelected$.getValue().filter( (e) => e.selected);
      const findElement = elementsSelected
          .find((e)=>e.corresp === correspId && e.id === lbId);


      if (findElement){
        this.evtHighlineService.lineBeginningSelected$.next(
          elementsSelected.filter((e)=>e.corresp !== correspId && e.id !== lbId),
        );


      } else {

        this.evtHighlineService.lineBeginningSelected$.next([
          ...elementsSelected,
          {
            id: lbId, corresp: correspId, selected: true,
          }]);
      }
    }
    $event.preventDefault();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @HostListener('mouseover',['$event']) mouseOver($event: any) {
    if (this._content.type.name === AdditionComponent.name){
      return;
    }
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lbId = (this._content as any).lbId;
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const correspId = (this._content as any).correspId;

    if ((lbId === '' ||correspId  === '') ){
      return;
    }
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const textComponent = (this._content as any).text;

    if (textComponent === '' || textComponent === ' ' ||
        ((this._content as GenericElement).type.name === Verse.name && !(this._content as GenericElement).attributes['facs'] ) ||
         (this._content as GenericElement).type.name === Paragraph.name
        ){
      return;
    }

    $event.preventDefault();
    const elementsSelected = this.evtHighlineService.lineBeginningSelected$.getValue().filter( (e) => e.selected);

    if ((this._content as GenericElement).type.name === Verse.name && (this._content as GenericElement).attributes['facs'] ){

      const facsId = (this._content as GenericElement).attributes['facs'].replace('#', '');
      const id = (this._content as GenericElement).attributes['id'];
      this.evtHighlineService.lineBeginningSelected$.next([
        {
        id: facsId, corresp: id, selected: undefined,
      }, ...elementsSelected]);


    } else {

      this.evtHighlineService.lineBeginningSelected$.next([
        {
        id: lbId, corresp: correspId, selected: undefined,
      }, ...elementsSelected]);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @HostListener('mouseleave', ['$event']) mouseLeave($event: any) {

    $event.preventDefault();
    const elementsSelected = this.evtHighlineService.lineBeginningSelected$.getValue().filter( (e) => e.selected);
    this.evtHighlineService.lineBeginningSelected$.next(elementsSelected);
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
  }
}
