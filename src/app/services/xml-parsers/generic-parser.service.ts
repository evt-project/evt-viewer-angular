import { Injectable } from '@angular/core';
import { TextComponent } from '../../components/text/text.component';
import { TextData, GenericElementData, NoteData, HTMLData, CommentData } from '../../models/parsed-elements';
import { GenericElementComponent } from '../../components/generic-element/generic-element.component';
import { Observable, of } from 'rxjs';
import { NoteComponent } from 'src/app/components/note/note.component';
import { xpath } from 'src/app/utils/domUtils';

export type ParsedElement = HTMLData | TextData | GenericElementData | CommentData | NoteData;

@Injectable()
export class GenericParserService {
  parse(xml: HTMLElement): Observable<ParsedElement> {
    if (xml) {
      if (xml.nodeType === 3) {  // Text
        return this.parseText(xml);
      }
      if (xml.nodeType === 8) { // Comment
        return of({} as CommentData);
      }

      switch (xml.tagName.toLowerCase()) {
        case 'note':
          return this.parseNote(xml);
        default:
          return this.parseElement(xml);
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
      content: Array.from(xml.childNodes),
      attributes: this.getAttributes(xml)
    };
    return of(genericElement);
  }

  private parseNote(xml: HTMLElement): Observable<NoteData> {
    const noteElement = {
      type: NoteComponent,
      path: xpath(xml),
      content: Array.from(xml.childNodes),
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
