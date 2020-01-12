import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map, scan } from 'rxjs/operators';
import { GenericElementComponent } from '../../components/generic-element/generic-element.component';
import { NoteComponent } from '../../components/note/note.component';
import { TextComponent } from '../../components/text/text.component';
import { NamedEntitiesList, XMLElement } from '../../models/evt-models';
import { CommentData, GenericElementData, HTMLData, NoteData, TextData } from '../../models/parsed-elements';
import { isNestedInElem, xpath } from '../../utils/dom-utils';
import { replaceMultispaces } from '../../utils/xml-utils';

export type ParsedElement = HTMLData | TextData | GenericElementData | CommentData | NoteData | NamedEntitiesList;

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

  parseF = {
    note: this.parseNote,
  };

  parse(xml: XMLElement): ParsedElement {
    if (!xml) { return { content: [xml] } as HTMLData; }
    // Text Node
    if (xml.nodeType === 3) { return this.parseText(xml); }
    // Comment
    if (xml.nodeType === 8) { return {} as CommentData; }
    const tagName = xml.tagName.toLowerCase();
    const parseFunction = this.parseF[tagName] || this.parseElement;

    return parseFunction.call(this, xml);
  }

  private parseText(xml: XMLElement): TextData {
    const text = {
      type: TextComponent,
      text: replaceMultispaces(xml.textContent),
      attributes: {},
    } as TextData;

    return text;
  }

  private parseElement(xml: XMLElement): GenericElementData {
    const genericElement: GenericElementData = {
      type: GenericElementComponent,
      class: xml.tagName ? xml.tagName.toLowerCase() : '',
      content: this.parseChildren(xml),
      attributes: this.getAttributes(xml),
    };

    return genericElement;
  }

  private parseNote(xml: XMLElement): NoteData {
    const footerNote = isNestedInElem(xml, 'div', [{ key: 'type', value: 'footer' }]);
    if (footerNote) {
      return this.parseElement(xml);
    }
    const noteElement = {
      type: NoteComponent,
      path: xpath(xml),
      content: this.parseChildren(xml),
      attributes: this.getAttributes(xml),
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
