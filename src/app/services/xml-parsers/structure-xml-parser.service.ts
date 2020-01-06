import { Injectable } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';

import { PageData, XMLElement } from '../../models/evt-models';
import { getElementsAfterTreeNode, getElementsBetweenTreeNode } from '../../utils/dom-utils';
import { Map } from '../../utils/js-utils';
import { EditionDataService } from '../edition-data.service';
import { GenericParserService } from './generic-parser.service';
import { WitnessesParserService } from './witnesses-parser.service';

@Injectable({
  providedIn: 'root',
})
export class StructureXmlParserService {
  public readonly editionStructure$ = this.editionDataService.parsedEditionSource$
    .pipe(
      map((source) => this.init(source)),
      shareReplay(1),
    );

  constructor(
    private editionDataService: EditionDataService,
    private genericParserService: GenericParserService,
    private witParserService: WitnessesParserService,
  ) {

  }

  getPages() {
    return this.editionStructure$.pipe(
      map(editionStructure => editionStructure.pagesIndexes.map(pageId => editionStructure.pages[pageId])));
  }

  init(document: XMLElement) {
    const pages: Map<PageData> = {};
    const pagesIndexes: string[] = [];
    const pageTagName = 'pb';

    if (document) {
      const pageElements = document.querySelectorAll(pageTagName);
      const l = pageElements.length;
      if (l > 0) {
        for (let i = 0; i < l; i++) {
          const element = pageElements[i];
          let pageContent = [];
          if (i < l - 1) { // TODO: handle last page
            pageContent = getElementsBetweenTreeNode(element, pageElements[i + 1]);
          } else {
            pageContent = getElementsAfterTreeNode(element);
          }

          const page: PageData = {
            id: element.getAttribute('xml:id') || 'page_' + (pagesIndexes.length + 1),
            label: element.getAttribute('n') || 'Page ' + (pagesIndexes.length + 1),
            originalContent: pageContent,
            parsedContent: pageContent.map(child => this.genericParserService.parse(child as XMLElement)),
          };
          pages[page.id] = page;
          pagesIndexes.push(page.id);
        }
      } else {
        // No <pb> used => TODO: Decide how to handle text division
        console.warn('TODO: Decide how to handle text division when there are no <pb>s');
        const mainText = document.querySelector('text');
        const content = Array.from(mainText.childNodes);
        const page: PageData = {
          id: `page_${new Date().getTime()}`,
          label: 'Main Text',
          originalContent: content as XMLElement[],
          parsedContent: content.map(child => this.genericParserService.parse(child as XMLElement)).filter(c => !!c.content),
        };
        pages[page.id] = page;
        pagesIndexes.push(page.id);
      }
      console.log(pages);
    }

    this.witParserService.parsedList$.subscribe(); //TEMP to test parser

    return {
      pages,
      pagesIndexes,
    };
  }
}
