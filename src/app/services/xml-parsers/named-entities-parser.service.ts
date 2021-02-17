import { Injectable } from '@angular/core';
import { parse, ParserRegister } from '.';
import {
  NamedEntitiesList, NamedEntity, NamedEntityOccurrence, NamedEntityOccurrenceRef, Page, XMLElement,
} from '../../models/evt-models';
import { isNestedInElem } from '../../utils/dom-utils';
import { Map } from '../../utils/js-utils';
import { GenericElemParser } from './basic-parsers';
import { getListsToParseTagNames, namedEntitiesListsTagNamesMap } from './named-entity-parsers';
import { createParser } from './parser-models';

@Injectable({
  providedIn: 'root',
})
export class NamedEntitiesParserService {
  private tagNamesMap = namedEntitiesListsTagNamesMap;

  public parseLists(document: XMLElement) {
    const listsToParse = getListsToParseTagNames();
    const listParser = ParserRegister.get('evt-named-entities-list-parser');
    // We consider only first level lists; inset lists will be considered
    const lists = Array.from(document.querySelectorAll<XMLElement>(listsToParse.toString()))
      .filter((list) => !isNestedInElem(list, list.tagName))
      .map((l) => listParser.parse(l) as NamedEntitiesList);

    return {
      lists,
      entities: lists.map(({ content }) => content).reduce((a, b) => a.concat(b), []),
      relations: lists.map(({ relations }) => relations).reduce((a, b) => a.concat(b), []),
    };
  }

  public getResultsByType(lists: NamedEntitiesList[], entities: NamedEntity[], type: string[]) {
    return {
      lists: lists.filter(list => type.indexOf(list.namedEntityType) >= 0),
      entities: entities.filter(entity => type.indexOf(entity.namedEntityType) >= 0),
    };
  }

  public parseNamedEntitiesOccurrences(pages: Page[]) {
    return pages.map(p => this.getNamedEntitiesOccurrencesInPage(p))
      .reduce(
        (x, y) => {
          Object.keys(y).forEach(k => {
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
      .filter(e => e.nodeType === 1)
      .map(e => {
        const occurrences = [];
        if (this.tagNamesMap.occurrences.indexOf(e.tagName) >= 0 && e.getAttribute('ref')) { // Handle first level page contents
          occurrences.push(this.parseNamedEntityOccurrence(e));
        }

        return occurrences.concat(Array.from(e.querySelectorAll<XMLElement>(this.tagNamesMap.occurrences))
          .map(el => this.parseNamedEntityOccurrence(el)));
      })
      .filter(e => e.length > 0)
      .reduce((x, y) => x.concat(y), [])
      .reduce(
        (x, y) => {
          const refsByDoc: NamedEntityOccurrenceRef[] = x[y.ref] ? x[y.ref].refsByDoc || [] : [];
          const docRefs = refsByDoc.find(r => r.docId === y.docId);
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
      docId: doc ? doc.getAttribute('xml:id') : '', // TODO: get proper document id when missing
      docLabel: doc ? doc.getAttribute('n') || doc.getAttribute('xml:id') : '', // TODO: get proper document label when attributes missing
    };
  }
}
