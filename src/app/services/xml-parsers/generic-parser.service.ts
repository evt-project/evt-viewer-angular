import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map, scan } from 'rxjs/operators';
import { AttributesData, NamedEntitiesList, XMLElement } from '../../models/evt-models';
import { CommentData, GenericElementData, HTMLData, LbData, NoteData, NoteLayout, ParagraphData, TextData } from '../../models/parsed-elements';
import { isNestedInElem, xpath } from '../../utils/dom-utils';
import { replaceMultispaces } from '../../utils/xml-utils';
import { NamedEntityRefData, NamedEntityType } from './../../models/evt-models';

export type ParsedElement = HTMLData | TextData | GenericElementData | CommentData | NoteData | NamedEntitiesList | LbData;

function complexElements(nodes: NodeListOf<ChildNode>): ChildNode[] {
  return Array.from(nodes).filter((n) => n.nodeType !== 8);
}

type SupportedTagNames = 'event' | 'geogname' | 'lb' | 'note' | 'orgname' | 'p' | 'persname' | 'placename' | 'ptr';

@Injectable()
export class GenericParserService {

  addTask = new Subject<number>();

  tasksInQueue = this.addTask.pipe(
    scan((x, y) => x + y, 0),
  );

  isBusy = this.tasksInQueue.pipe(
    map((n) => n !== 0),
  );

  parseF: { [T in SupportedTagNames]: (x: XMLElement) => ParsedElement } = {
    event: this.parseNamedEntityRef,
    geogname: this.parseNamedEntityRef,
    lb: this.parseLb,
    note: this.parseNote,
    orgname: this.parseNamedEntityRef,
    p: this.parseParagrah,
    persname: this.parseNamedEntityRef,
    placename: this.parseNamedEntityRef,
    ptr: this.parsePtr,
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

  public parseText(xml: XMLElement): TextData {
    const text = {
      type: TextData,
      text: replaceMultispaces(xml.textContent),
      attributes: {},
    } as TextData;

    return text;
  }

  public parseParagrah(xml: XMLElement): ParagraphData {
    const paragraphComponent: ParagraphData = {
      type: ParagraphData,
      content: this.parseChildren(xml),
      attributes: this.parseAttributes(xml),
      n: this.parseAttributes(xml).n || '-1',
    };

    return paragraphComponent;
  }

  public parseElement(xml: XMLElement): GenericElementData {
    const genericElement: GenericElementData = {
      type: GenericElementData,
      class: xml.tagName ? xml.tagName.toLowerCase() : '',
      content: this.parseChildren(xml),
      attributes: this.parseAttributes(xml),
    };

    return genericElement;
  }

  private parseNote(xml: XMLElement): NoteData {
    let noteLayout: NoteLayout = 'popover';
    if (isNestedInElem(xml, 'div', [{ key: 'type', value: 'footer' }]) // FOOTER NOTE
      || isNestedInElem(xml, 'person') || isNestedInElem(xml, 'place') || isNestedInElem(xml, 'org')
      || isNestedInElem(xml, 'relation') || isNestedInElem(xml, 'event') // NAMED ENTITY NOTE
      || isNestedInElem(xml, 'app')
    ) {
      noteLayout = 'plain-text';
    }
    let noteType = xml.getAttribute('type') ?? 'comment';
    if (isNestedInElem(xml, 'app')) {
      noteType = 'critical';
    }

    const noteElement = {
      type: NoteData,
      noteType,
      noteLayout,
      exponent: xml.getAttribute('n'),
      path: xpath(xml),
      content: this.parseChildren(xml),
      attributes: this.parseAttributes(xml),
    };

    return noteElement;
  }

  private parseNamedEntityRef(xml: XMLElement): NamedEntityRefData | GenericElementData {
    const ref = xml.getAttribute('ref');
    if (!ref) {
      return this.parseElement(xml);
    }

    const neTypeMap: { [key: string]: NamedEntityType } = {
      placename: 'place',
      geogname: 'place',
      persname: 'person',
      orgname: 'org',
      event: 'event',
    };

    return {
      type: NamedEntityRefData,
      entityId: ref ? ref.replace(/#/g, '') : '',
      entityType: neTypeMap[xml.tagName.toLowerCase()],
      path: xpath(xml),
      content: this.parseChildren(xml),
      attributes: this.parseAttributes(xml),
      class: xml.tagName.toLowerCase(),
    };
  }

  private parsePtr(xml: XMLElement) {
    if (xml.getAttribute('type') === 'noteAnchor' && xml.getAttribute('target')) {
      const noteId = xml.getAttribute('target').replace('#', '');
      const rootNode = xml.closest('TEI');
      const noteEl = rootNode.querySelector<XMLElement>(`note[*|id="${noteId}"]`);

      return noteEl ? this.parseNote(noteEl) : this.parseElement(xml);
    }

    return this.parseElement(xml);
  }

  private parseLb(xml: XMLElement) {
    return {
      id: xml.getAttribute('xml:id') || xpath(xml),
      n: xml.getAttribute('n') || '',
      rend: xml.getAttribute('rend'),
      facs: xml.getAttribute('facs'),
      type: LbData,
      content: [],
      attributes: this.parseAttributes(xml),
    };
  }

  private parseChildren(xml: XMLElement) {
    return complexElements(xml.childNodes).map(child => this.parse(child as XMLElement));
  }

  public parseAttributes(xml: XMLElement): AttributesData {
    return Array.from(xml.attributes)
      .map(({ name, value }) => ({ [name === 'xml:id' ? 'id' : name.replace(':', '-')]: value }))
      .reduce((x, y) => ({ ...x, ...y }), {});
  }
}
