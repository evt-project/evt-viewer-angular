import { Injectable } from '@angular/core';
import { AttributesMap } from 'ng-dynamic-component';
import { AppConfig } from '../../app.config';
import {
  Description, NamedEntitiesList, NamedEntity, NamedEntityInfo,
  NamedEntityLabel, NamedEntityOccurrence, NamedEntityOccurrenceRef, NamedEntityType, PageData, Relation, XMLElement,
} from '../../models/evt-models';
import { isNestedInElem, xpath } from '../../utils/dom-utils';
import { Map } from '../../utils/js-utils';
import { replaceNewLines } from '../../utils/xml-utils';
import { GenericParserService } from './generic-parser.service';

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

  constructor(
    private genericParserService: GenericParserService,
  ) {
  }

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
      attributes: this.parseAttributes(list),
    };
    list.childNodes.forEach((child: XMLElement) => {
      if (child.nodeType === 1) {
        switch (child.tagName.toLowerCase()) {
          case 'head':
            parsedList.label = replaceNewLines(child.textContent);
            break;
          case 'desc':
            parsedList.description.push(this.genericParserService.parse(child));
            break;
          case 'relation':
            if (this.neListsConfig.relations.enabled) {
              parsedList.relations.push(this.parseRelation(child));
            }
            break;
          case 'listrelation':
            if (this.neListsConfig.relations.enabled) {
              child.querySelectorAll<XMLElement>('relation').forEach(r => parsedList.relations.push(this.parseRelation(r)));
            }
            break;
          default:
            if (this.getListsToParseTagNames().indexOf(child.tagName) >= 0) {
              const parsedSubList = this.parseList(child);
              parsedList.sublists.push(parsedSubList);
              parsedList.content = parsedList.content.concat(parsedSubList.content);
              parsedList.relations = parsedList.relations.concat(parsedSubList.relations);
            } else {
              parsedList.content.push(this.parseNamedEntity(child));
            }
        }
      }
    });
    parsedList.label = parsedList.label || list.getAttribute('type') || `List of ${parsedList.namedEntityType}`;

    return parsedList;
  }

  private parseNamedEntity(xml: XMLElement): NamedEntity {
    switch (xml.tagName) {
      case 'person':
        return this.parsePerson(xml);
      case 'personGrp':
        return this.parsePersonGroup(xml);
      case 'place':
        return this.parsePlace(xml);
      case 'org':
        return this.parseOrganization(xml);
      case 'event':
        return this.parseEvent(xml);
      default:
        console.error('Warning! Parser not implemented for this element in list', xml);

        return;
    }
  }

  private parseGenericEntity(xml: XMLElement): NamedEntity {
    const elId = xml.getAttribute('xml:id') || xpath(xml);
    const label = replaceNewLines(xml.textContent) || 'No info';
    const entity: NamedEntity = {
      type: NamedEntity,
      id: elId,
      sortKey: xml.getAttribute('sortKey') || (label ? label[0] : '') || xml.getAttribute('xml:id') || xpath(xml),
      originalEncoding: xml,
      label,
      namedEntityType: this.getEntityType(xml.tagName),
      content: Array.from(xml.children).map((subchild: XMLElement) => this.parseEntityInfo(subchild)),
      attributes: this.parseAttributes(xml),
    };

    return entity;
  }

  private parsePerson(xml: XMLElement): NamedEntity {
    const nameElement = xml.querySelector<XMLElement>('name');
    const forenameElement = xml.querySelector<XMLElement>('forename');
    const surnameElement = xml.querySelector<XMLElement>('surname');
    const persNameElement = xml.querySelector<XMLElement>('persName');
    const occupationElement = xml.querySelector<XMLElement>('occupation');
    let label: NamedEntityLabel = 'No info';
    if (persNameElement) {
      label = replaceNewLines(persNameElement.textContent) || 'No info';
    } else if (forenameElement || surnameElement) {
      label += forenameElement ? `${replaceNewLines(forenameElement.textContent)} ` : '';
      label += surnameElement ? `${replaceNewLines(surnameElement.textContent)} ` : '';
    } else if (nameElement) {
      label = replaceNewLines(nameElement.textContent) || 'No info';
    } else {
      label = replaceNewLines(xml.textContent) || 'No info';
    }
    label += occupationElement ? ` (${replaceNewLines(occupationElement.textContent)})` : '';

    return {
      ...this.parseGenericEntity(xml),
      label,
    };
  }

  private parsePersonGroup(xml: XMLElement): NamedEntity {
    const role = xml.getAttribute('role');
    let label: NamedEntityLabel = 'No info';
    if (role) {
      label = role.trim();
    } else {
      label = replaceNewLines(xml.textContent) || 'No info';
    }

    return {
      ...this.parseGenericEntity(xml),
      label,
    };
  }

  private parsePlace(xml: XMLElement): NamedEntity {
    const placeNameElement = xml.querySelector<XMLElement>('placeName');
    const settlementElement = xml.querySelector<XMLElement>('settlement');
    let label: NamedEntityLabel = 'No info';
    if (placeNameElement) {
      label = replaceNewLines(placeNameElement.textContent) || 'No info';
    } else if (settlementElement) {
      label = replaceNewLines(settlementElement.textContent) || 'No info';
    }

    return {
      ...this.parseGenericEntity(xml),
      label,
    };
  }

  private parseOrganization(xml: XMLElement): NamedEntity {
    const orgNameElement = xml.querySelector<XMLElement>('orgName');

    return {
      ...this.parseGenericEntity(xml),
      label: (orgNameElement ? replaceNewLines(orgNameElement.textContent) : '') || 'No info',
    };
  }

  private parseEvent(xml: XMLElement): NamedEntity {
    const eventLabelElement = xml.querySelector<XMLElement>('label');

    return {
      ...this.parseGenericEntity(xml),
      label: (eventLabelElement ? replaceNewLines(eventLabelElement.textContent) : '') || 'No info',
    };
  }

  private parseRelation(xml: XMLElement): Relation {
    const active = xml.getAttribute('active') || '';
    const mutual = xml.getAttribute('mutual') || '';
    const passive = xml.getAttribute('passive') || '';
    const descriptionEls = xml.querySelectorAll<XMLElement>('desc');
    const relation: Relation = {
      type: Relation,
      name: xml.getAttribute('name'),
      activeParts: active.replace(/#/g, '').split(' '),
      mutualParts: mutual.replace(/#/g, '').split(' '),
      passiveParts: passive.replace(/#/g, '').split(' '),
      relationType: xml.getAttribute('type'),
      attributes: this.genericParserService.parseAttributes(xml),
      content: Array.from(xml.children).map((subchild: XMLElement) => this.parseEntityInfo(subchild)),
      description: [],
    };
    if (descriptionEls && descriptionEls.length > 0) {
      descriptionEls.forEach((el) => (relation.description as Description).push(this.genericParserService.parse(el)));
    } else {
      relation.description = [this.genericParserService.parseText(xml)];
    }
    const parentListEl = xml.parentElement.tagName === 'listRelation' ? xml.parentElement : undefined;
    if (parentListEl) {
      relation.relationType = `${(parentListEl.getAttribute('type') || '')} ${(relation.relationType || '')}`.trim();
    }

    return relation;
  }

  private parseEntityInfo(xml: XMLElement): NamedEntityInfo {
    return {
      type: NamedEntityInfo,
      label: xml.nodeType === 1 ? xml.tagName.toLowerCase() : 'info',
      content: [this.genericParserService.parse(xml)],
      attributes: xml.nodeType === 1 ? this.parseAttributes(xml) : {},
    };
  }

  private parseAttributes(xml: XMLElement) {
    const attributes: AttributesMap = {};
    Array.from(xml.attributes).forEach((attr) => {
      attributes[attr.name] = attr.value;
    });

    return attributes;
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

  private getEntityType(tagName): NamedEntityType {
    return tagName.toLowerCase();
  }

  public parseNamedEntitiesOccurrences(pages: PageData[]) {
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

  public getNamedEntitiesOccurrencesInPage(p: PageData): Array<Map<NamedEntityOccurrence>> {
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

    return {
      ref: xml.getAttribute('ref').replace('#', ''),
      el: this.genericParserService.parseElement(xml),
      docId: doc ? doc.getAttribute('xml:id') : '', // TODO: get proper document id when missing
      docLabel: doc ? doc.getAttribute('n') || doc.getAttribute('xml:id') : '', // TODO: get proper document label when attributes missing
    };
  }
}
