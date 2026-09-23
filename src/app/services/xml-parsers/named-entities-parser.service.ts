import { Injectable } from '@angular/core';
import { parse, ParserRegister } from '.';
import {
  NamedEntitiesList, NamedEntity, NamedEntityOccurrence, NamedEntityOccurrenceRef, Page, XMLElement,
} from '../../models/evt-models';
import { isNestedInElem } from '../../utils/dom-utils';
import { Map } from '../../utils/js-utils';
import { GenericElemParser } from './basic-parsers';
import { createParser, getID, getNOrDefaultFromElement } from './parser-models';
import { EditionSource } from '../named-entities.service';
import { AppConfig } from 'src/app/app.config';
import { ErrorsService } from '../errors.service';

@Injectable({
  providedIn: 'root',
})
export class NamedEntitiesParserService {
  private entitiesOccurrenceSelectors: string[];

  constructor(private errorsService: ErrorsService) {
    this.entitiesOccurrenceSelectors = AppConfig.evtSettings.edition.entitiesOccurrenceSelectors;
    if (!this.entitiesOccurrenceSelectors.length) {
      this.errorsService.logError("No namedEntitiesOccurrenceSelector found in edition config");
    }
  }

  public parseLists(editionSources: EditionSource[]) {
    const listsToParse = AppConfig.getListsToParseTagNames();
    const listParser = ParserRegister.get('evt-named-entities-list-parser');
    // We consider only first level lists; inset lists will be considered
    const listsSelector = listsToParse.map(x => x.listSelector).toString();
    const lists = editionSources.flatMap(ed => Array.from(ed.editionData.querySelectorAll<XMLElement>(listsSelector)));
    const glossaryLists = editionSources.flatMap(ed => ed.glossary ? Array.from(ed.glossary.querySelectorAll<XMLElement>(listsSelector)) : []);
    const allLists = [...lists, ...glossaryLists]
      .filter((list) => !isNestedInElem(list, list.tagName))
      .map((l) => listParser.parse(l) as NamedEntitiesList);

    const mergedLists: NamedEntitiesList[] = [];
    const map = new Map<string, NamedEntitiesList>();
    for (const list of allLists) {
      const storedList = map.get(list.label);
      if (!storedList) {
        map.set(list.label, list);
        mergedLists.push(list);
      }
      else {
        storedList.content.push(...list.content);
        const result = storedList.content.countBy(x => x.id);
        result.forEach(x => {
          if (x.count > 1) {
            const duplicatedElements = x.items.map(y => y.originalEncoding);
            this.errorsService.logError("More than one named entity has the same xml:id, keeping first one", duplicatedElements);
            const first = x.items[0];
            storedList.content = storedList.content.filter(entity => {
              return entity.id !== x.key || entity === first;
            });
          }
        });
      }
    }

    return {
      lists: mergedLists,
      entities: mergedLists.flatMap(({ content }) => content),
      relations: mergedLists.flatMap(({ relations }) => relations)
    };
  }

  public getResultsByType(lists: NamedEntitiesList[], entities: NamedEntity[], type: string) {
    const result = {
      lists: lists.filter((list) => type === list.namedEntityType),
      entities: entities.filter((entity) => type === entity.namedEntityType),
    };
    return result;
  }

  public parseNamedEntitiesOccurrences(pages: Page[]) {
    return pages.map((p) => this.getNamedEntitiesOccurrencesInPage(p))
      .reduce(
        (x, y) => {
          Object.keys(y).forEach((k) => {
            if (x[k]) {
              x[k] = x[k].concat([y[k]]);
            } else {
              x[k] = [y[k]];
            }
          });

          return x;
        },
        {});
  }

  public getNamedEntitiesOccurrencesInPage(p: Page): Array<Map<NamedEntityOccurrence>> {
    return p.originalContent
      .filter((e) => e.nodeType === 1)
      .map((e) => {
        const occurrences = [];
        if (this.entitiesOccurrenceSelectors.includes(e.tagName) && e.getAttribute('ref')) { // Handle first level page contents
          occurrences.push(this.parseNamedEntityOccurrence(e));
        }

        const selector = this.entitiesOccurrenceSelectors.join(',');
        return occurrences.concat(Array.from(e.querySelectorAll<XMLElement>(selector))
          .map((el) => this.parseNamedEntityOccurrence(el)));
      })
      .filter((e) => e.length > 0)
      .reduce((x, y) => x.concat(y), [])
      .reduce(
        (x, y) => {
          const refsByDoc: NamedEntityOccurrenceRef[] = x[y.ref] ? x[y.ref].refsByDoc || [] : [];
          const docRefs = refsByDoc.find((r) => r.docId === y.docId);
          if (docRefs) {
            docRefs.refs.push(y.el);
          } else {
            refsByDoc.push({
              docId: y.docId,
              refs: [y.el],
              docLabel: y.docLabel,
            });
          }

          return {
            ...x, [y.ref]: {
              pageId: p.id,
              pageLabel: p.label,
              refsByDoc,
            },
          } as Array<Map<NamedEntityOccurrence>>;
        },
        {});
  }

  private parseNamedEntityOccurrence(xml: XMLElement) {
    const doc = xml.closest('text');
    const elementParser = createParser(GenericElemParser, parse);

    return {
      ref: xml.getAttribute('ref').replace('#', ''),
      el: elementParser.parse(xml),
      docId: doc ? getID(doc) : '', // TODO: get proper document id when missing
      docLabel: doc ?  (getNOrDefaultFromElement(doc) || getID(doc)) : '', // TODO: get proper document label when attributes missing
    };
  }
}
