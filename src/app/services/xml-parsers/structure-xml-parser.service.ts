import { Injectable } from '@angular/core';

import { OriginalEncodingNodeType, Page, XMLElement } from '../../models/evt-models';
import { getElementsAfterTreeNode, getElementsBetweenTreeNode, isNestedInElem } from '../../utils/dom-utils';
import { Map } from '../../utils/js-utils';
import { GenericParserService } from './generic-parser.service';

@Injectable({
  providedIn: 'root',
})
export class StructureXmlParserService {
  constructor(
    private genericParserService: GenericParserService,
  ) {
  }

  parsePages(document: XMLElement) {
    const pages: Map<Page> = {};
    const pagesIndexes: string[] = [];
    const pageTagName = 'pb';

    if (document) {
      const pageElements = document.querySelectorAll(pageTagName);
      const pagesNumber = pageElements.length;

      if (pagesNumber > 0) {
        this.parseDocumentPages(pageElements, pagesNumber, pages, pagesIndexes);
      } else {
        this.parseDocument(document, pages, pagesIndexes);
      }
    }

    return {
      pages,
      pagesIndexes,
    };
  }

  parseDocumentPages(pageElements: NodeListOf<Element>, pagesNumber: number, pages: Map<Page>, pagesIndexes: string[]) {
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
        id: element.getAttribute('xml:id') || 'page_' + (pagesIndexes.length + 1),
        label: element.getAttribute('n') || 'Page ' + (pagesIndexes.length + 1),
        originalContent: pageContent,
        parsedContent: this.parsePageContent(pageContent),
      };
      pages[page.id] = page;
      pagesIndexes.push(page.id);
    });
  }

  parseDocument(document: XMLElement, pages: Map<Page>, pagesIndexes: string[]) {
    // TODO: Decide how to handle text division when there are no <pb>s
    const mainText = document.querySelector('text');
    let content = Array.from(mainText.childNodes);
    content = this.removeBackNodes(content as XMLElement[]);
    const page: Page = {
      id: 'page_1',
      label: 'Main Text',
      originalContent: content as XMLElement[],
      parsedContent: content.map((child) => this.genericParserService.parse(child as XMLElement))
        // tslint:disable-next-line: no-string-literal
        .filter(c => !!c['content']), // TODO: FIXME: fix property access
    };
    pages[page.id] = page;
    pagesIndexes.push(page.id);
  }

  parsePageContent(pageContent: OriginalEncodingNodeType[]) {
   const parsedContent = [];
   pageContent.map((child: XMLElement) => {
      if (isNestedInElem(child, 'front')) {
        if (child.nodeType === 3 || isNestedInElem(child, '', [{ key: 'type', value:'document_front' }])) {
          parsedContent.push(this.genericParserService.parse(child));
         } else {
          const frontOriginalContentChild = child.querySelectorAll('[type="document_front"]');
          if (child.querySelectorAll('[type="document_front"]').length > 0) {
            Array.from(frontOriginalContentChild).forEach((c) => parsedContent.push(this.genericParserService.parse(c as XMLElement)));
          }
          if (child.getAttribute('type') === 'document_front') {
            parsedContent.push(this.genericParserService.parse(child));
          }
        }
      } else {
        parsedContent.push(this.genericParserService.parse(child));
      }
    });

   return parsedContent;
  }

  getFrontOriginalElements(el: HTMLElement) {
    return el.nodeType !== 3 &&
      (el.getAttribute('type') === 'document_front' ||
      el.querySelectorAll('[type=document_front]').length > 0) ||
      isNestedInElem(el, '', [{ key: 'type', value:'document_front' }]);
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
