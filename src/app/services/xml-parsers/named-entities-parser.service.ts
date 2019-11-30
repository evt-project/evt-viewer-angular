import { Injectable } from '@angular/core';
import { map, shareReplay, tap } from 'rxjs/operators';
import { NamedEntitiesList, NamedEntity } from '../../models/evt-models';
import { isNestedInElem, xpath } from '../../utils/dom-utils';
import { EditionDataService } from '../edition-data.service';

@Injectable({
  providedIn: 'root',
})
export class NamedEntitiesParserService {
  public readonly parsedLists$ = this.editionDataService.parsedEditionSource$
    .pipe(
      tap((source) => console.log(source)),
      map((source) => this.parseLists(source)),
      tap((source) => console.log('parsedLists', source)),
      shareReplay(1),
    );
  constructor(
    private editionDataService: EditionDataService,
  ) { }

  private parseLists(document: HTMLElement) {
    const lists = document.querySelectorAll(this.getListsToParseTagName());
    const parsedLists: NamedEntitiesList[] = [];
    let parsedEntities: NamedEntity[] = [];
    lists.forEach((list: HTMLElement) => {
      // We consider only first level lists; inset lists will be considered differently
      if (!isNestedInElem(list, list.tagName)) {
        const parsedList = this.parseList(list);
        parsedLists.push(parsedList);
        parsedEntities = parsedEntities.concat(parsedList.entities);
      }
    });

    return { lists: parsedLists, entities: parsedEntities };
  }

  private parseList(list: HTMLElement) {
    const parsedList: NamedEntitiesList = {
      id: list.getAttribute('xml:id') || xpath(list),
      label: '',
      type: list.tagName.replace('list', '').toLowerCase(),
      entities: [],
      sublists: [],
      originalEncoding: list,
    };
    list.childNodes.forEach((child: HTMLElement) => {
      if (child.nodeType === 1) {
        if (child.tagName.toLowerCase() === 'head') {
          parsedList.label = child.textContent;
        } else if (child.tagName.toLowerCase() === 'desc') {
          parsedList.desc = child.textContent; // TODO: evaluate if save all XML element and delegate parser to content-viewer
        } else if (this.getListsToParseTagName().indexOf(child.tagName) >= 0) {
          const parsedSubList = this.parseList(child);
          parsedList.sublists.push(parsedSubList);
          parsedList.entities = parsedList.entities.concat(parsedSubList.entities);
        } else {
          parsedList.entities.push({ // TODO: push parser results
            id: child.getAttribute('xml:id') || xpath(child),
            label: child.textContent,
          });
        }
      }
    });

    return parsedList;
  }

  /**
   * @todo: return tags depending on config
   */
  private getListsToParseTagName() {
    return 'listPerson, listPlace, listOrg';
  }
}
