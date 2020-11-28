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
      const pageElements: NodeListOf<XMLElement> = document.querySelectorAll(pageTagName);

      if (pageElements.length > 0) {
        pageElements.forEach((page, pageIndex, pagesCollection) => {
          pages.push(this.parseDocumentPage(page, pageIndex, pagesCollection));
        });
      } else {
        this.parseDocument(document, pages);
      }
    }

    return {
      pages,
    };
  }

  parseDocumentPage(page: XMLElement, pageIndex: number, pagesCollection: NodeListOf<XMLElement>): Page {
    let pageContent: XMLElement[] = [];

    if (pagesCollection.length === 1) {
      pageContent = getElementsAfterTreeNode(page);
    }

    if (pagesCollection.length !== 1) {
      const isFirstPage = pageIndex === 0;
      const isLastPage = pageIndex === pagesCollection.length - 1;

      if (isFirstPage) {
        pageContent = getElementsBetweenTreeNode(page, pagesCollection[pageIndex + 1]);
      }

      if (isLastPage) {
        pageContent = getElementsAfterTreeNode(page);
      }

      if (!isFirstPage && !isLastPage) {
        pageContent = getElementsBetweenTreeNode(page, pagesCollection[pageIndex + 1]);
      }
    }

    return {
      id: page.getAttribute('xml:id') || 'page_' + pageIndex,
      label: page.getAttribute('n') || 'Page ' + pageIndex,
      originalContent: pageContent,
      parsedContent: this.parsePageContent(pageContent),
    };
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
