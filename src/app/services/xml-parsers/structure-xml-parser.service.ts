import { Injectable } from '@angular/core';
import { EditionStructure, GenericElement, OriginalEncodingNodeType, Page, XMLElement } from '../../models/evt-models';
import { createNsResolver, getElementsBetweenTreeNode, isNestedInElem } from '../../utils/dom-utils';
import { GenericParserService } from './generic-parser.service';
import { getID, ParseResult } from './parser-models';

@Injectable({
  providedIn: 'root',
})
export class StructureXmlParserService {
  constructor(
    private genericParserService: GenericParserService,
  ) {
  }

  private frontOrigContentAttr = 'document_front';

  parsePages(el: XMLElement): EditionStructure {
    if (!el) { return { pages: [] }; }

    const pageTagName = 'pb';
    const frontTagName = 'front';
    const bodyTagName = 'body';

    const frontElement = el.querySelector(frontTagName) as XMLElement;
    const bodyElement = el.querySelector(bodyTagName);

    const pbs = Array.from(el.querySelectorAll(pageTagName));
    const frontPbs = pbs.filter((p) => isNestedInElem(p, frontTagName));
    const bodyPbs = pbs.filter((p) => isNestedInElem(p, bodyTagName));

    const doc = el.firstElementChild.ownerDocument;

    const frontPages = frontPbs.length === 0 && this.isMarkedAsOrigContent(frontElement)
      ? [this.parseSinglePage(doc, frontElement, 'page_front', 'front')]
      : frontPbs.map((pb, idx, arr) => this.parseDocumentPage(doc, pb as HTMLElement, arr[idx + 1] as HTMLElement, frontTagName));

    const bodyPages = bodyPbs.length > 0
      ? bodyPbs.map((pb, idx, arr) => this.parseDocumentPage(doc, pb as HTMLElement, arr[idx + 1] as HTMLElement, bodyTagName))
      : [this.parseSinglePage(doc, bodyElement, 'page1', 'mainText')]; // TODO: tranlsate mainText

    return {
      pages: [...frontPages, ...bodyPages],
    };
  }

  parseDocumentPage(doc: Document, pb: XMLElement, nextPb: XMLElement, ancestorTagName: string): Page {

    /* If there is a next page we retrieve the elements between two page nodes 
    otherweise we retrieve the nodes between the page node and the last node of the body node */
    const nextNode = nextPb || Array.from(doc.querySelectorAll(ancestorTagName)).reverse()[0].lastChild; // TODO: check if querySelectorAll can return an empty array in this case
    const originalContent = getElementsBetweenTreeNode(pb, nextNode)
      .filter((n) => n.tagName !== 'pb')
      .filter((c) => ![4, 7, 8].includes(c.nodeType)) // Filter comments, CDATAs, and processing instructions

    return {
      id: getID(pb, 'page'),
      label: pb.getAttribute('n') || 'page',
      originalContent,
      parsedContent: this.parsePageContent(doc, originalContent),
    };
  }

  private parseSinglePage(doc: Document, el: XMLElement, id: string, label: string): Page {
    const originalContent: XMLElement[] = getElementsBetweenTreeNode(el.firstChild, el.lastChild);

    return {
      id,
      label,
      originalContent,
      parsedContent: this.parsePageContent(doc, originalContent),
    };
  }

  parsePageContent(doc: Document, pageContent: OriginalEncodingNodeType[]): Array<ParseResult<GenericElement>> {
    return pageContent
      .map((node) => getEditionOrigNode(node, doc))
      .map((node) => {
        if (node.nodeName === 'front' || isNestedInElem(node, 'front')) {
          if (this.isMarkedAsOrigContent(node)) { return [this.genericParserService.parse(node)]; }
          if (this.hasOriginalContent(node)) {
            return Array.from(node.querySelectorAll(`[type=${this.frontOrigContentAttr}]`))
              .map((c) => this.genericParserService.parse(c as XMLElement))
          }
          return [] as ParseResult<GenericElement>[];
        }
        if (node.tagName === 'text' && node.querySelectorAll && node.querySelectorAll('front').length > 0) {
          return this.parsePageContent(doc, Array.from(node.children) as HTMLElement[]);
        }
        return [this.genericParserService.parse(node)];
      })
      .reduce((x, y) => x.concat(y), [])
      ;
  }

  hasOriginalContent(el: XMLElement): boolean {
    return el.querySelectorAll(`[type=${this.frontOrigContentAttr}]`).length > 0;
  }

  isMarkedAsOrigContent(el: XMLElement): boolean {
    return el.nodeType !== 3 &&
      (el.getAttribute('type') === this.frontOrigContentAttr ||
        this.hasOriginalContent(el) ||
        isNestedInElem(el, '', [{ key: 'type', value: this.frontOrigContentAttr }])
      );
  }
}

function getEditionOrigNode(el: XMLElement, doc: Document) {
  if (el.getAttribute && el.getAttribute('xpath')) {
    const path = doc.documentElement.namespaceURI ? el.getAttribute('xpath').replace(/\//g, '/ns:') : el.getAttribute('xpath');
    const xpathRes = doc.evaluate(path, doc, createNsResolver(doc), XPathResult.ANY_TYPE, undefined);
    return xpathRes.iterateNext() as XMLElement;
  }
  return el;
}
