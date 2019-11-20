import { Injectable } from '@angular/core';
import { TextComponent } from '../../components/text/text.component';
import { TextData, GenericElementData, NoteData } from '../../models/parsed-elements';
import { GenericElementComponent } from '../../components/generic-element/generic-element.component';
import { Observable, of } from 'rxjs';
import { NoteComponent } from 'src/app/components/note/note.component';
import { xpath } from 'src/app/utils/domUtils';

@Injectable()
export class GenericParserService {
  parse(xml: HTMLElement): Promise<any> {
    if (xml) {
      if (xml.nodeType === 3) {  // Text
        return this.parseText(xml);
      }
      if (xml.nodeType === 8) { // Comment
        Promise.resolve({ type: 'comment' });
      }

      switch (xml.tagName.toLowerCase()) {
        case 'note':
          return this.parseNote(xml);
        default:
          return this.parseElement(xml);
      }
    } else {
      return Promise.resolve();
    }
  }

  private parseText(xml: HTMLElement): Promise<TextData> {
    const text = {
      type: TextComponent,
      text: xml.textContent,
      attributes: {}
    } as TextData;
    return Promise.resolve(text);
  }

  private parseElement(xml: HTMLElement): Promise<GenericElementData> {
    const genericElement: GenericElementData = {
      type: GenericElementComponent,
      class: xml.tagName ? xml.tagName.toLowerCase() : '',
      content: Array.from(xml.childNodes),
      attributes: this.getAttributes(xml)
    };
    console.log('genericElement', genericElement);
    return Promise.resolve(genericElement);
  }

  private parseNote(xml: HTMLElement): Promise<NoteData> {
    const noteElement = {
      type: NoteComponent,
      path: xpath(xml),
      content: Array.from(xml.childNodes),
      attributes: this.getAttributes(xml)
    };
    console.log('noteElement', noteElement);
    return Promise.resolve(noteElement);
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
