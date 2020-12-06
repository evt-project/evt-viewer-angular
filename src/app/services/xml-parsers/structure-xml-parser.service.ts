import { Injectable } from '@angular/core';

import { GenericElement, OriginalEncodingNodeType, Page, XMLElement } from '../../models/evt-models';
import { getElementsBetweenTreeNode, isNestedInElem, xpath } from '../../utils/dom-utils';
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

    if (document) {
      const pageElements: NodeListOf<XMLElement> = document.querySelectorAll(pageTagName);

      if (pageElements.length > 0) {
        pageElements.forEach((page, pageIndex, pagesCollection) => {
          pages.push(this.parseDocumentPage(document, page, pagesCollection[pageIndex + 1]));
        });
      } else {
        pages.push(...this.parseDocumentAsPages(document));
      }
    }

    return {
      pages,
    };
  }

  parseDocumentPage(document: XMLElement, page: XMLElement, nextPage: XMLElement): Page {
    let pageContent: XMLElement[] = [];
    const bodyLastNode = document.querySelector('body').lastChild;

    /* If there is a next page we retrieve the elements between two page nodes
    otherweise we retrieve the nodes between the page node and the last node of the body node */
    if (nextPage) {
      pageContent = getElementsBetweenTreeNode(page, nextPage).filter((n) => n.tagName !== 'pb');
    } else {
      pageContent = getElementsBetweenTreeNode(page, bodyLastNode);
    }

    pageContent.filter((c) => c.nodeType !== 8);

    return {
      id: page.getAttribute('xml:id') || 'page' + xpath(page),
      label: page.getAttribute('n') || 'page',
      originalContent: pageContent,
      parsedContent: this.parsePageContent(pageContent),
    };
  }

  parseDocumentAsPages(document: XMLElement): Page[] {
    const pages: Page[] = [];
    const mainText = document.querySelector('text');
    const bodyLastNode = document.querySelector('body').lastChild;
    let pageContent: XMLElement[] = getElementsBetweenTreeNode(mainText, bodyLastNode);
    const pageContentFront = pageContent.filter((c) => c.nodeName === 'front');
    const hasFrontOriginalContent = this.hasFrontOriginalContent(pageContentFront[0] as HTMLElement);

    if (hasFrontOriginalContent) {
      const frontPage: Page = {
        id: 'page_front',
        label: 'front',
        originalContent: pageContentFront,
        parsedContent: this.parsePageContent(pageContentFront),
      };
      pages.push(frontPage);
      // Front is already parsed
      pageContent = pageContent.filter((c) => c.nodeName !== 'front');
    }

    const page: Page = {
      id: 'page_1',
      label: 'mainText',
      originalContent: pageContent,
      parsedContent: this.parsePageContent(pageContent),
    };
    pages.push(page);

    return pages;
  }

  parsePageContent(pageContent: OriginalEncodingNodeType[]): Array<ParseResult<GenericElement>> {
    const parsedContent = [];
    pageContent.map((child: XMLElement) => {
      /* Check if the node is a front element or is nested in front element or is marked as original content */
      if (child.nodeName === 'front' || child.dataset.xpath.includes('front') ||
        (child.nodeType !== 3 && child.nodeType !== 8 && child.getAttribute('type') === this.frontOriginalContentAttr)) {

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
        parsedContent.push(this.genericParserService.parse(child));
      }
    });

    return parsedContent;
  }

  hasFrontOriginalContent(el: HTMLElement): boolean {
    return el.nodeType !== 3 &&
      (el.getAttribute('type') === this.frontOriginalContentAttr ||
      el.querySelectorAll(`[type=${this.frontOriginalContentAttr}]`).length > 0) ||
      isNestedInElem(el, '', [{ key: 'type', value: this.frontOriginalContentAttr }]);
  }
}
