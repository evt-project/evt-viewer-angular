import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
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
  readonly frontTagName = 'front';
  readonly pageTagName = 'pb';
  readonly bodyTagName = 'body';

  parsePages(el: XMLElement): EditionStructure {
    if (!el) { return { pages: [] }; }

    const front: XMLElement = el.querySelector(this.frontTagName);
    const body: XMLElement = el.querySelector(this.bodyTagName);

    const pbs = Array.from(el.querySelectorAll(this.pageTagName)).filter((p) => !p.getAttribute('ed'));
    const frontPbs = pbs.filter((p) => isNestedInElem(p, this.frontTagName));
    const bodyPbs = pbs.filter((p) => isNestedInElem(p, this.bodyTagName));
    const doc = el.firstElementChild.ownerDocument;

    if (frontPbs.length > 0 && bodyPbs.length > 0) {
      return {
        pages: pbs.map((pb: XMLElement, idx, arr: XMLElement[]) => this.parseDocumentPage(doc, pb, arr[idx + 1], 'text')),
      };
    }

    const frontPages = frontPbs.length === 0 && front && this.isMarkedAsOrigContent(front)
      ? [this.parseSinglePage(doc, front, 'page_front', this.frontTagName, 'facs_front')]
      : frontPbs.map((pb, idx, arr) => this.parseDocumentPage(doc, pb as HTMLElement, arr[idx + 1] as HTMLElement, this.frontTagName));

    const bodyPages = bodyPbs.length === 0
      ? [this.parseSinglePage(doc, body, 'page1', 'mainText', 'facs1')] // TODO: tranlsate mainText
      : bodyPbs.map((pb, idx, arr) => this.parseDocumentPage(doc, pb as HTMLElement, arr[idx + 1] as HTMLElement, this.bodyTagName));

    return {
      pages: [...frontPages, ...bodyPages],
    };
  }

  parseDocumentPage(doc: Document, pb: XMLElement, nextPb: XMLElement, ancestorTagName: string): Page {
    /* If there is a next page we retrieve the elements between two page nodes
    otherweise we retrieve the nodes between the page node and the last node of the body node */
    // TODO: check if querySelectorAll can return an empty array in this case
    const nextNode = nextPb || Array.from(doc.querySelectorAll(ancestorTagName)).reverse()[0].lastChild;
    const originalContent = getElementsBetweenTreeNode(pb, nextNode)
      .filter((n) => n.tagName !== this.pageTagName)
      .filter((c) => ![4, 7, 8].includes(c.nodeType)); // Filter comments, CDATAs, and processing instructions

    return {
      id: getID(pb, 'page'),
      label: pb.getAttribute('n') || 'page',
      facs: (pb.getAttribute('facs') || 'page').split('#').slice(-1)[0],
      originalContent,
      parsedContent: this.parsePageContent(doc, originalContent),
      url: this.getPageUrl(getID(pb, 'page')),
      facsUrl: this.getPageUrl((pb.getAttribute('facs') || getID(pb, 'page')).split('#').slice(-1)[0]),
    };
  }

  private parseSinglePage(doc: Document, el: XMLElement, id: string, label: string, facs: string): Page {
    const originalContent: XMLElement[] = getElementsBetweenTreeNode(el.firstChild, el.lastChild);

    return {
      id,
      label,
      facs,
      originalContent,
      parsedContent: this.parsePageContent(doc, originalContent),
      url: this.getPageUrl(id),
      facsUrl: this.getPageUrl(facs || id),
    };
  }

  private getPageUrl(id) {
    // TODO: check if exists <graphic> element connected to page and return its url
    // TODO: handle multiple version of page
    const image = id.split('.')[0];

    //Nel file_config imagesFolderUrls deve terminare già con uno /
    return `${AppConfig.evtSettings.files.imagesFolderUrls.single}${image}.jpg`;
  }
  // lbId = '';
  // quando trovi un lbId allora lbId = 'qualcosa'


  parsePageContent(doc: Document, pageContent: OriginalEncodingNodeType[]): Array<ParseResult<GenericElement>> {
    return pageContent
      .map((node) => {

        const origEl = getEditionOrigNode(node, doc);

        if (origEl.nodeName === this.frontTagName || isNestedInElem(origEl, this.frontTagName)) {
          if (this.hasOriginalContent(origEl)) {
            return Array.from(origEl.querySelectorAll(`[type=${this.frontOrigContentAttr}]`))
              .map((c) => this.genericParserService.parse(c as XMLElement));
          }
          if (this.isMarkedAsOrigContent(origEl)) {
            return [this.genericParserService.parse(origEl)];
          }

          return [] as Array<ParseResult<GenericElement>>;
        }

        if (origEl.tagName === 'text' && origEl.querySelectorAll && origEl.querySelectorAll(this.frontTagName).length > 0) {
          return this.parsePageContent(doc, Array.from(origEl.children) as HTMLElement[]);
        }

        return [this.genericParserService.parse(origEl)];
      })
      .reduce((x, y) => x.concat(y), []);
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
