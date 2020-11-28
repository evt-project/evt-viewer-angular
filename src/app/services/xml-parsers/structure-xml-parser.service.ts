import { Injectable } from '@angular/core';

import { OriginalEncodingNodeType, Page, XMLElement } from '../../models/evt-models';
import { getElementsAfterTreeNode, getElementsBetweenTreeNode, isNestedInElem } from '../../utils/dom-utils';
import { GenericParserService } from './generic-parser.service';

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
      const pageElements = document.querySelectorAll(pageTagName);
      const pagesNumber = pageElements.length;

      if (pagesNumber > 0) {
        this.parseDocumentPages(pageElements, pagesNumber, pages);
      } else {
        this.parseDocument(document, pages);
      }
    }

    return {
      pages,
    };
  }

  parseDocumentPages(pageElements: NodeListOf<Element>, pagesNumber: number, pages: Page[]) {
    pageElements.forEach((element, i) => {
      let pageContent: XMLElement[] = [];

      if (pagesNumber === 1) {
        pageContent = getElementsAfterTreeNode(element);
      }

      if (pagesNumber !== 1) {
        const isFirstPage = i === 0;
        const isLastPage = i === pagesNumber - 1;

        if (isFirstPage) {
          pageContent = getElementsBetweenTreeNode(element, pageElements[i + 1]);
        }

        if (isLastPage) {
          pageContent = getElementsAfterTreeNode(element);
        }

        if (!isFirstPage && !isLastPage) {
          pageContent = getElementsBetweenTreeNode(element, pageElements[i + 1]);
        }
      }

      pageContent = this.removeBackNodes(pageContent);

      const page: Page = {
        id: element.getAttribute('xml:id') || 'page_' + i,
        label: element.getAttribute('n') || 'Page ' + i,
        originalContent: pageContent,
        parsedContent: this.parsePageContent(pageContent),
      };
      pages.push(page);
    });
  }

  parseDocument(document: XMLElement, pages: Page[]) {
    const mainText = document.querySelector('text');
    let content = Array.from(mainText.childNodes);
    const contentFront = content.filter((c) => c.nodeName === 'front');
    const hasFrontOriginalContent = this.hasFrontOriginalContent(contentFront[0] as HTMLElement);
    content = this.removeBackNodes(content as XMLElement[]);

    if (hasFrontOriginalContent) {
      const frontPage: Page = {
        id: 'page_front',
        label: 'Front',
        originalContent: contentFront as XMLElement[],
        parsedContent: this.parsePageContent(contentFront as OriginalEncodingNodeType[]).filter(c => !!c.content),
      };
      pages.push(frontPage);
      content = content.filter((c) => c.nodeName !== 'front');
    }

    const page: Page = {
      id: 'page_1',
      label: 'Main Text',
      originalContent: content as XMLElement[],
      parsedContent: this.parsePageContent(content as OriginalEncodingNodeType[]).filter(c => !!c.content),
    };

    pages.push(page);
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

  hasFrontOriginalContent(el: HTMLElement): boolean {
    return el.nodeType !== 3 &&
      (el.getAttribute('type') === this.frontOriginalContentAttr ||
      el.querySelectorAll(`[type=${this.frontOriginalContentAttr}]`).length > 0) ||
      isNestedInElem(el, '', [{ key: 'type', value: this.frontOriginalContentAttr }]);
  }

  removeBackNodes(content: OriginalEncodingNodeType[]) {
    return content.filter(el => {
      if (el.nodeType === 3) {
        return !el.parentElement.closest('back') && el.parentElement.tagName !== 'back';
      }
      if (el.nodeType === 1) {
        return !el.closest('back') && el.tagName !== 'back';
      }

      return false;
    });
  }
}
