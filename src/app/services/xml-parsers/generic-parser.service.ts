import { Injectable } from '@angular/core';
import { TextComponent } from '../../components/text/text.component';
import { TextData, GenericElementData, NoteData, HTMLData, CommentData } from '../../models/parsed-elements';
import { GenericElementComponent } from '../../components/generic-element/generic-element.component';
import { Observable, of, Subject } from 'rxjs';
import { NoteComponent } from 'src/app/components/note/note.component';
import { xpath, isNestedInElem } from 'src/app/utils/domUtils';
import { scan, map, tap } from 'rxjs/operators';

export type ParsedElement = HTMLData | TextData | GenericElementData | CommentData | NoteData;

function complexElements(nodes: NodeListOf<ChildNode>): ChildNode[] {
  return Array.from(nodes).filter((n) => n.nodeType !== 8);
}

@Injectable()
export class GenericParserService {

  addTask = new Subject<number>();

  tasksInQueue = this.addTask.pipe(
    scan((x, y) => x + y, 0),
  );

  isBusy = this.tasksInQueue.pipe(
    map((n) => n !== 0),
  );

  constructor() {
    this.tasksInQueue.subscribe((x) => console.log('pending task', x));
  }

  parse(xml: HTMLElement): Observable<ParsedElement> {
    if (xml) {
      if (xml.nodeType === 3) {  // Text
        return this.parseText(xml).pipe(tap(() => this.addTask.next(-1)));
      }
      if (xml.nodeType === 8) { // Comment
        return of({} as CommentData).pipe(tap(() => this.addTask.next(-1)));
      }
      this.addTask.next(complexElements(xml.childNodes).length);
      switch (xml.tagName.toLowerCase()) {
        case 'note':
          const footerNote = isNestedInElem(xml, 'div', [{ key: 'type', value: 'footer' }]);
          if (footerNote) {
            return this.parseElement(xml).pipe(tap(() => this.addTask.next(-1)));
          } else {
            return this.parseNote(xml).pipe(tap(() => this.addTask.next(-(xml.childNodes.length + 1))));
          }
        default:
          return this.parseElement(xml).pipe(tap(() => this.addTask.next(-1)));
      }
    } else {
      return of({ element: xml } as HTMLData);
    }
  }

  private parseText(xml: HTMLElement): Observable<TextData> {
    const text = {
      type: TextComponent,
      text: xml.textContent,
      attributes: {}
    } as TextData;
    return of(text);
  }

  private parseElement(xml: HTMLElement): Observable<GenericElementData> {
    const genericElement: GenericElementData = {
      type: GenericElementComponent,
      class: xml.tagName ? xml.tagName.toLowerCase() : '',
      content: complexElements(xml.childNodes),
      attributes: this.getAttributes(xml)
    };
    return of(genericElement);
  }

  private parseNote(xml: HTMLElement): Observable<NoteData> {
    const noteElement = {
      type: NoteComponent,
      path: xpath(xml),
      content: complexElements(xml.childNodes),
      attributes: this.getAttributes(xml)
    };
    return of(noteElement);
  }

  private getAttributes(xml: HTMLElement) {
    const attributes = {};
    for (const attribute of Array.from(xml.attributes)) {
      if (attribute.specified) {
        const attrName = attribute.name === 'xml:id' ? 'id' : attribute.name.replace(':', '-');
        attributes[attrName] = attribute.value;
      }
    }
    return attributes;
  }
}
