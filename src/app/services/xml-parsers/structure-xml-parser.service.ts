import { Injectable } from '@angular/core';
import { GenericElement, OriginalEncodingNodeType, Page, XMLElement } from '../../models/evt-models';
import { createNsResolver, getElementsBetweenTreeNode, isNestedInElem, isNodeNestedInElem, xpath } from '../../utils/dom-utils';
import { GenericParserService } from './generic-parser.service';
import { ParseResult } from './parser-models';

@Injectable({
  providedIn: 'root',
})
export class StructureXmlParserService {
  constructor(
    private genericParserService: GenericParserService,
  ) {
  }

  private frontOriginalContentAttr = 'document_front';

  parsePages(document: XMLElement) {
    const pages: Page[] = [];
    const pageTagName = 'pb';
    const frontTagName = 'front';
    const bodyTagName = 'body';

    if (document) {
      const pageElements: NodeListOf<XMLElement> = document.querySelectorAll(pageTagName);

      if (pageElements.length > 0) {
        const frontPageElements = Array.from(pageElements).filter((p) => isNestedInElem(p, frontTagName));
        const bodyPageElements = Array.from(pageElements).filter((p) => isNestedInElem(p, bodyTagName));
        const frontElement = document.querySelector(frontTagName) as XMLElement;

        if (frontPageElements.length > 0) {
          frontPageElements.forEach((page, pageIndex, pagesCollection) => {
            pages.push(this.parseDocumentPage(document, page, pagesCollection[pageIndex + 1], frontTagName));
          });
        }

        if (frontPageElements.length === 0 && this.hasFrontOriginalContent(frontElement)) {
          pages.push(this.parseDocumentFront(document, frontElement));
        }

        if (bodyPageElements.length > 0) {
          bodyPageElements.forEach((page, pageIndex, pagesCollection) => {
            pages.push(this.parseDocumentPage(document, page, pagesCollection[pageIndex + 1], bodyTagName));
          });
        }
      } else {
        pages.push(...this.parseDocumentAsPages(document));
      }
    }

    return {
      pages,
    };
  }

  parseDocumentPage(doc: XMLElement, page: XMLElement, nextPage: XMLElement, ancestorTagName: string): Page {
    let pageContent: XMLElement[] = [];

    /* If there is a next page we retrieve the elements between two page nodes
    otherweise we retrieve the nodes between the page node and the last node of the body node */
    if (nextPage) {
      pageContent = getElementsBetweenTreeNode(page, nextPage).filter((n) => n.tagName !== 'pb');
    } else {
      const ancestorEls = Array.from(doc.querySelectorAll(ancestorTagName));
      const ancestorLastNode = ancestorEls[ancestorEls.length - 1].lastChild;
      pageContent = getElementsBetweenTreeNode(page, ancestorLastNode);
    }

    pageContent.filter((c) => c.nodeType !== 8);

    return {
      id: page.getAttribute('xml:id') || 'page' + xpath(page),
      label: page.getAttribute('n') || 'page',
      originalContent: pageContent,
      parsedContent: this.parsePageContent(doc, pageContent),
    };
  }

  parseDocumentFront(doc: XMLElement, el: XMLElement) {
    const mainText = doc.querySelector('text');
    const frontLastNode = el.lastChild;
    const pageContent: XMLElement[] = getElementsBetweenTreeNode(mainText, frontLastNode);

    return {
      id: 'page_front',
      label: 'front',
      originalContent: pageContent,
      parsedContent: this.parsePageContent(doc, pageContent),
    };
  }

  parseDocumentAsPages(document: XMLElement): Page[] {
    const pages: Page[] = [];
    const mainText = document.querySelector('text');
    const bodyEls = Array.from(document.querySelectorAll('body'));
    const bodyLastNode = bodyEls[bodyEls.length - 1].lastChild;
    let pageContent: XMLElement[] = getElementsBetweenTreeNode(mainText, bodyLastNode);
    const pageContentFront = pageContent.filter((c) => c.nodeName === 'front');
    const hasFrontOriginalContent = this.hasFrontOriginalContent(pageContentFront[0] as HTMLElement);

    if (hasFrontOriginalContent) {
      const frontPage: Page = {
        id: 'page_front',
        label: 'front',
        originalContent: pageContentFront,
        parsedContent: this.parsePageContent(document, pageContentFront),
      };
      pages.push(frontPage);
      // Front is already parsed
      pageContent = pageContent.filter((c) => c.nodeName !== 'front');
    }

    const page: Page = {
      id: 'page_1',
      label: 'mainText',
      originalContent: pageContent,
      parsedContent: this.parsePageContent(document, pageContent),
    };
    pages.push(page);

    return pages;
  }

  parsePageContent(doc: XMLElement, pageContent: OriginalEncodingNodeType[]): Array<ParseResult<GenericElement>> {
    let parsedContent = [];
    pageContent.map((child) => {
      let origEl = child;

      if (origEl.getAttribute && origEl.getAttribute('xpath')) {
        const docNS = (doc as unknown as Document).documentElement.namespaceURI;
        // tslint:disable-next-line: no-null-keyword
        const nsResolver = docNS ? createNsResolver(doc as unknown as Document) : null;
        const path = docNS ? child.getAttribute('xpath').replace(/\//g, '/ns:') : child.getAttribute('xpath');
        // tslint:disable-next-line: no-null-keyword
        const xpathRes: XPathResult = (doc as unknown as Document).evaluate(path, doc, nsResolver, XPathResult.ANY_TYPE, null);
        origEl = xpathRes.iterateNext() as XMLElement;
      }

      /* Check if the node is a front element or is nested in front element or is marked as original content */
      if (origEl.nodeName === 'front' || (origEl && isNestedInElem(origEl, 'front')) ||
        (origEl.nodeType !== 3 && origEl.nodeType !== 8 && origEl.getAttribute('type') === this.frontOriginalContentAttr)) {
        /* Check if the node is a text node or nested in an element marked as original content and parses it */
        if (child.nodeType === 3 || isNestedInElem(child, '', [{ key: 'type', value: this.frontOriginalContentAttr }])) {
          parsedContent.push(this.genericParserService.parse(child));
        } else {
          /* Check if the node has child nodes marked as original content and parses it */
          const frontOriginalContentChild = child.querySelectorAll(`[type=${this.frontOriginalContentAttr}]`);
          if (child.querySelectorAll(`[type=${this.frontOriginalContentAttr}]`).length > 0) {
            Array.from(frontOriginalContentChild).forEach((c) => parsedContent.push(this.genericParserService.parse(c as XMLElement)));
          }
          if (child.getAttribute('type') === this.frontOriginalContentAttr) {
            parsedContent.push(this.genericParserService.parse(child));
          }
        }
      } else {
        if (child.tagName === 'text' && child.querySelectorAll && child.querySelectorAll('front').length > 0) {
          parsedContent = parsedContent.concat(this.parsePageContent(doc, Array.from(child.children) as HTMLElement[]));
        } else {
          parsedContent.push(this.genericParserService.parse(child));
        }
      }
    });

    return parsedContent;
  }

  hasFrontOriginalContent(el: XMLElement): boolean {
    return el.nodeType !== 3 &&
      (el.getAttribute('type') === this.frontOriginalContentAttr ||
      el.querySelectorAll(`[type=${this.frontOriginalContentAttr}]`).length > 0) ||
      isNestedInElem(el, '', [{ key: 'type', value: this.frontOriginalContentAttr }]);
  }
}
