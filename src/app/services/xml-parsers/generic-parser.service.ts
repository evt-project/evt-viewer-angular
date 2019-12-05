import { Injectable } from '@angular/core';
import { TextComponent } from '../../components/text/text.component';
import { TextData, GenericElementData, NoteData, HTMLData, CommentData } from '../../models/parsed-elements';
import { GenericElementComponent } from '../../components/generic-element/generic-element.component';
import { Subject } from 'rxjs';
import { NoteComponent } from 'src/app/components/note/note.component';
import { xpath, isNestedInElem } from 'src/app/utils/domUtils';
import { scan, map } from 'rxjs/operators';

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

  parse(xml: HTMLElement): ParsedElement {
    if (xml) {
      if (xml.nodeType === 3) {  // Text
        return this.parseText(xml);
      }
      if (xml.nodeType === 8) { // Comment
        return {} as CommentData;
      }
      this.addTask.next(complexElements(xml.childNodes).length);
      switch (xml.tagName.toLowerCase()) {
        case 'note':
          const footerNote = isNestedInElem(xml, 'div', [{ key: 'type', value: 'footer' }]);
          if (footerNote) {
            return this.parseElement(xml);
          } else {
            return this.parseNote(xml);
          }
        default:
          return this.parseElement(xml);
      }
    } else {
      return { content: [xml] } as HTMLData;
    }
  }

  private parseText(xml: HTMLElement): TextData {
    const text = {
      type: TextComponent,
      text: xml.textContent,
      attributes: {}
    } as TextData;
    return text;
  }

  private parseElement(xml: HTMLElement): GenericElementData {
    const genericElement: GenericElementData = {
      type: GenericElementComponent,
      class: xml.tagName ? xml.tagName.toLowerCase() : '',
      content: this.parseChildren(xml),
      attributes: this.getAttributes(xml)
    };
    return genericElement;
  }

  private parseNote(xml: HTMLElement): NoteData {
    const noteElement = {
      type: NoteComponent,
      path: xpath(xml),
      content: this.parseChildren(xml),
      attributes: this.getAttributes(xml)
    };
    return noteElement;
  }

  private parseChildren(xml: HTMLElement) {
    return complexElements(xml.childNodes).map(child => this.parse(child as HTMLElement));
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
