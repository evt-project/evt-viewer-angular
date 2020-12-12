import { Injectable } from '@angular/core';

import { OriginalEncodingNodeType, Page, XMLElement } from '../../models/evt-models';
import { getElementsAfterTreeNode, getElementsBetweenTreeNode, isNestedInElem } from '../../utils/dom-utils';
import { GenericParserService } from './generic-parser.service';
import { getID } from './parser-models';

@Injectable({
  providedIn: 'root',
})
export class StructureXmlParserService {
  constructor(
    private genericParserService: GenericParserService,
  ) {
  }

  private frontTagName = 'front';
  private frontOriginalContentAttr = 'document_front';
  private bodyTagName = 'body';

  parsePages(document: XMLElement) {
    const pages: Page[] = [];
    const pageTagName = 'pb';

    if (document) {
      const frontElement: XMLElement = document.querySelector(this.frontTagName);
      const bodyElement: XMLElement = document.querySelector(this.bodyTagName);
      const frontPageElements: NodeListOf<XMLElement> = frontElement.querySelectorAll(pageTagName);
      const bodyPageElements: NodeListOf<XMLElement> = bodyElement.querySelectorAll(pageTagName);

      if (frontPageElements.length === 0) {
        pages.push(this.parseElementAsPage(frontElement));
      } else {
        frontPageElements.forEach((page, pageIndex, pagesCollection) => {
          pages.push(this.parseDocumentPage(page, pageIndex, pagesCollection));
        });
      }

      if (bodyPageElements.length === 0) {
        pages.push(this.parseElementAsPage( bodyElement));
      } else {
        bodyPageElements.forEach((page, pageIndex, pagesCollection) => {
          pages.push(this.parseDocumentPage(page, pageIndex, pagesCollection));
        });
      }
    }

    return {
      pages,
    };
  }

  parseElementAsPage(el: XMLElement): Page {
    const content = Array.from(el.childNodes).filter((p) => p.nodeType !== 8);

    if (el.nodeName === this.frontTagName && this.hasFrontOriginalContent(el)) {
      return {
        id: 'page_front',
        label: 'Front',
        originalContent: content as XMLElement[],
        parsedContent: this.parsePageContent(content as OriginalEncodingNodeType[]),
      };
    }

    return {
      id: 'page_1',
      label: 'Main Text',
      originalContent: content as XMLElement[],
      parsedContent: this.parsePageContent(content as OriginalEncodingNodeType[]),
    };
  }

  parseDocumentPage(page: XMLElement, pageIndex: number, pagesCollection: NodeListOf<XMLElement>): Page {
    let pageContent: XMLElement[] = [];

    if (pagesCollection.length === 1) {
      pageContent = getElementsAfterTreeNode(page);
    }

    if (pagesCollection.length !== 1) {
      const isLastPage = pageIndex === pagesCollection.length - 1;

      if (isLastPage) {
        pageContent = getElementsAfterTreeNode(page);
      } else {
        pageContent = getElementsBetweenTreeNode(page, pagesCollection[pageIndex + 1]);
      }
    }

    /* Remove comment nodes */
    pageContent = pageContent.filter((p) => p.nodeType !== 8);

    return {
      id: getID(page) || 'page_' + pageIndex,
      label: page.getAttribute('n') || 'Page ' + pageIndex,
      originalContent: pageContent,
      parsedContent: this.parsePageContent(pageContent),
    };
  }

  parsePageContent(pageContent: OriginalEncodingNodeType[]) {
   const parsedContent = [];
   pageContent.map((child: XMLElement) => {
      if (isNestedInElem(child, 'front') || child.nodeName === 'front') {
        if (child.nodeType === 3 || isNestedInElem(child, '', [{ key: 'type', value: this.frontOriginalContentAttr }])) {
          parsedContent.push(this.genericParserService.parse(child));
         } else {
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

  hasFrontOriginalContent(el: XMLElement): boolean {
    return el.nodeType !== 3 &&
      (el.getAttribute('type') === this.frontOriginalContentAttr ||
      el.querySelectorAll(`[type=${this.frontOriginalContentAttr}]`).length > 0) ||
      isNestedInElem(el, '', [{ key: 'type', value: this.frontOriginalContentAttr }]);
  }
}
