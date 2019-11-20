import { Injectable } from '@angular/core';
import { TextComponent } from '../../components/text/text.component';
import { TextData, GenericElementData } from '../../models/parsed-elements';
import { GenericElementComponent } from '../../components/generic-element/generic-element.component';

@Injectable()
export class GenericParserService {

  constructor() { }

  private parseText(xml: HTMLElement): Promise<TextData> {
    const text = {
      type: TextComponent,
      text: xml.textContent
    } as TextData;
    return Promise.resolve(text);
  }

  private parseElement(xml: HTMLElement): Promise<GenericElementData> {
    const genericElement: GenericElementData = {
      type: GenericElementComponent,
      class: xml.tagName.toLowerCase(),
      content: Array.from(xml.childNodes),
      attributes: this.getAttributes(xml)
    };
    return Promise.resolve(genericElement);
  }

  parse(xml: HTMLElement): Promise<any> {
    if (xml) {
      if (xml.nodeType === 3) {  // Text
        return this.parseText(xml);
      }
      if (xml.nodeType === 8) { // Comment
        Promise.resolve({ type: 'comment' });
      }

      switch (xml.tagName) {
        default:
          return this.parseElement(xml);
      }
    } else {
      return Promise.resolve();
    }
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
