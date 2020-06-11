import { Injectable } from '@angular/core';
import { parse } from '.';
import { AppConfig } from '../../app.config';
import {
  NamedEntitiesList, NamedEntity, NamedEntityOccurrence, NamedEntityOccurrenceRef, NamedEntityType, Page, XMLElement,
} from '../../models/evt-models';
import { isNestedInElem, xpath } from '../../utils/dom-utils';
import { Map } from '../../utils/js-utils';
import { replaceNewLines } from '../../utils/xml-utils';
import { AttributeMapParser, ElementParser } from './basic-parsers';
import { RelationParser } from './named-entity-parsers';
import { createParser } from './parser-models';

@Injectable({
  providedIn: 'root',
})
export class NamedEntitiesParserService {
  private neListsConfig = AppConfig.evtSettings.edition.namedEntitiesLists || {};
  private tagNamesMap: { [key: string]: string } = {
    persons: 'listPerson',
    places: 'listPlace',
    organizations: 'listOrg',
    events: 'listEvent',
    occurrences: 'persName[ref], placeName[ref], orgName[ref], geogName[ref], event[ref]',
  };

  public parseLists(document: XMLElement) {
    const listsToParse = this.getListsToParseTagNames();
    // We consider only first level lists; inset lists will be considered
    const lists = Array.from(document.querySelectorAll<XMLElement>(listsToParse.toString()))
      .filter((list) => !isNestedInElem(list, list.tagName))
      .map((l) => this.parseList(l));

    return {
      lists,
      entities: lists.map(({ content }) => content).reduce((a, b) => a.concat(b), []),
      relations: lists.map(({ relations }) => relations).reduce((a, b) => a.concat(b), []),
    };
  }

  private parseList(list: XMLElement) {
    const attributeParser = createParser(AttributeMapParser, parse);
    const parsedList: NamedEntitiesList = {
      type: NamedEntitiesList,
      id: list.getAttribute('xml:id') || xpath(list),
      label: '',
      namedEntityType: this.getListType(list.tagName),
      content: [],
      sublists: [],
      originalEncoding: list,
      relations: [],
      description: [],
      attributes: attributeParser.parse(list),
    };

    const relationParse = createParser(RelationParser, parse);
    list.childNodes.forEach((child: XMLElement) => {
      if (child.nodeType === 1) {
        switch (child.tagName.toLowerCase()) {
          case 'head':
            parsedList.label = replaceNewLines(child.textContent);
            break;
          case 'desc':
            parsedList.description.push(parse(child));
            break;
          case 'relation':
            if (this.neListsConfig.relations.enabled) {
              parsedList.relations.push(relationParse.parse(child));
            }
            break;
          case 'listrelation':
            if (this.neListsConfig.relations.enabled) {
              child.querySelectorAll<XMLElement>('relation').forEach(r => parsedList.relations.push(relationParse.parse(r)));
            }
            break;
          default:
            if (this.getListsToParseTagNames().indexOf(child.tagName) >= 0) {
              const parsedSubList = this.parseList(child);
              parsedList.sublists.push(parsedSubList);
              parsedList.content = parsedList.content.concat(parsedSubList.content);
              parsedList.relations = parsedList.relations.concat(parsedSubList.relations);
            } else {
              parsedList.content.push(parse(child) as NamedEntity);
            }
        }
      }
    });
    parsedList.label = parsedList.label || list.getAttribute('type') || `List of ${parsedList.namedEntityType}`;

    return parsedList;
  }

  public getResultsByType(lists: NamedEntitiesList[], entities: NamedEntity[], type: string[]) {
    return {
      lists: lists.filter(list => type.indexOf(list.namedEntityType) >= 0),
      entities: entities.filter(entity => type.indexOf(entity.namedEntityType) >= 0),
    };
  }

  private getListsToParseTagNames() {
    return Object.keys(this.neListsConfig)
      .map((i) => this.neListsConfig[i].enabled ? this.tagNamesMap[i] : undefined)
      .filter(ne => !!ne);
  }

  private getListType(tagName): NamedEntityType {
    return tagName.replace('list', '').toLowerCase();
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
    const elementParser = createParser(ElementParser, parse);

    return {
      ref: xml.getAttribute('ref').replace('#', ''),
      el: elementParser.parse(xml),
      docId: doc ? doc.getAttribute('xml:id') : '', // TODO: get proper document id when missing
      docLabel: doc ? doc.getAttribute('n') || doc.getAttribute('xml:id') : '', // TODO: get proper document label when attributes missing
    };
  }
}
