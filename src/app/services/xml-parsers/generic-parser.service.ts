import { Injectable } from '@angular/core';
import { TextComponent } from '../../components/text/text.component';
import { TextData, GenericElementData, NoteData, HTMLData, CommentData } from '../../models/parsed-elements';
import { GenericElementComponent } from '../../components/generic-element/generic-element.component';
import { Subject } from 'rxjs';
import { NoteComponent } from 'src/app/components/note/note.component';
import { xpath, isNestedInElem } from 'src/app/utils/domUtils';
import { scan, map } from 'rxjs/operators';
import { XMLElement } from 'src/app/models/evt-models';

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

  parse(xml: XMLElement): ParsedElement {
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

  private parseText(xml: XMLElement): TextData {
    const text = {
      type: TextComponent,
      text: xml.textContent,
      attributes: {}
    } as TextData;
    return text;
  }

  private parseElement(xml: XMLElement): GenericElementData {
    const genericElement: GenericElementData = {
      type: GenericElementComponent,
      class: xml.tagName ? xml.tagName.toLowerCase() : '',
      content: this.parseChildren(xml),
      attributes: this.getAttributes(xml)
    };
    return genericElement;
  }

  private parseNote(xml: XMLElement): NoteData {
    const noteElement = {
      type: NoteComponent,
      path: xpath(xml),
      content: this.parseChildren(xml),
      attributes: this.getAttributes(xml)
    };
    return noteElement;
  }

  private parseChildren(xml: XMLElement) {
    return complexElements(xml.childNodes).map(child => this.parse(child as XMLElement));
  }

  private getAttributes(xml: XMLElement) {
    return Array.from(xml.attributes)
      .map((a) => ({ [a.name === 'xml:id' ? 'id' : a.name.replace(':', '-')]: a.value }))
      .reduce((x, y) => ({ ...x, ...y }), {});
  }
}
