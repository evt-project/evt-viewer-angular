import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { NamedEntities, NamedEntitiesList, NamedEntity, Relation } from '../../models/evt-models';
import { isNestedInElem, xpath } from '../../utils/dom-utils';
import { EditionDataService } from '../edition-data.service';

@Injectable({
  providedIn: 'root',
})
export class NamedEntitiesParserService {
  public readonly parsedLists$ = this.editionDataService.parsedEditionSource$.pipe(
    map((source) => this.parseLists(source)),
    shareReplay(1),
  );

  public readonly persons$ = this.parsedLists$.pipe(
    map(({ lists, entities }) => this.getResultsByType(lists, entities, 'person')),
  );

  public readonly places$ = this.parsedLists$.pipe(
    map(({ lists, entities }) => this.getResultsByType(lists, entities, 'place')),
  );

  public readonly organizations$ = this.parsedLists$.pipe(
    map(({ lists, entities }) => this.getResultsByType(lists, entities, 'org')),
  );

  public readonly relations$ = this.parsedLists$.pipe(
    map(({ relations }) => relations),
  );

  public readonly namedEntities$: Observable<NamedEntities> = combineLatest([
    this.persons$,
    this.places$,
    this.organizations$,
    this.relations$,
  ]).pipe(
    map(([persons, places, organizations, relations]) => ({
      persons,
      places,
      organizations,
      relations,
    })),
    shareReplay(1),
  );

  constructor(
    private editionDataService: EditionDataService,
  ) {
  }

  private parseLists(document: HTMLElement) {
    const lists = document.querySelectorAll(this.getListsToParseTagName());
    const parsedLists: NamedEntitiesList[] = [];
    let parsedEntities: NamedEntity[] = [];
    let parsedRelations: Relation[] = [];
    lists.forEach((list: HTMLElement) => {
      // We consider only first level lists; inset lists will be considered differently
      if (!isNestedInElem(list, list.tagName)) {
        const parsedList = this.parseList(list);
        parsedLists.push(parsedList);
        parsedEntities = parsedEntities.concat(parsedList.entities);
        parsedRelations = parsedRelations.concat(parsedList.relations);
      }
    });

    return { lists: parsedLists, entities: parsedEntities, relations: parsedRelations };
  }

  private parseList(list: HTMLElement) {
    const parsedList: NamedEntitiesList = {
      id: list.getAttribute('xml:id') || xpath(list),
      label: '',
      type: list.tagName.replace('list', '').toLowerCase(),
      entities: [],
      sublists: [],
      originalEncoding: list,
      relations: [],
    };
    list.childNodes.forEach((child: HTMLElement) => {
      if (child.nodeType === 1) {
        switch (child.tagName.toLowerCase()) {
          case 'head':
            parsedList.label = child.textContent;
            break;
          case 'desc':
            parsedList.desc = child;
            break;
          case 'persongrp':
            console.log('TODO: Handle <personGrp>', child);
            break;
          case 'relation':
            parsedList.relations.push(this.parseRelation(child));
            break;
          case 'listrelation':
            child.querySelectorAll('relation').forEach((r: HTMLElement) => {
              parsedList.relations.push(this.parseRelation(r));
            });
            break;
          default:
            if (this.getListsToParseTagName().indexOf(child.tagName) >= 0) {
              const parsedSubList = this.parseList(child);
              parsedList.sublists.push(parsedSubList);
              parsedList.entities = parsedList.entities.concat(parsedSubList.entities);
              parsedList.relations = parsedList.relations.concat(parsedSubList.relations);
            } else {
              parsedList.entities.push(this.parseNamedEntity(child));
            }
        }
      }
    });

    return parsedList;
  }

  private parseNamedEntity(xml: HTMLElement): NamedEntity {
    switch (xml.tagName) {
      case 'person':
        return this.parsePerson(xml);
      case 'place':
        return this.parsePlace(xml);
      case 'org':
        return this.parseOrganization(xml);
      default:
        console.error('Warning! Parser not implemented for this element in list', xml);

        return;
    }
  }

  private parseGenericEntity(xml: HTMLElement): NamedEntity {
    const elId = xml.getAttribute('xml:id') || xpath(xml);
    const entity: NamedEntity = {
      id: elId,
      originalEncoding: xml,
      label: xml.textContent,
      type: xml.tagName,
      info: [],
    };

    xml.childNodes.forEach((subchild: HTMLElement) => {
      if (subchild.nodeType === 1) {
        entity.info.push({
          label: subchild.tagName.toLowerCase(),
          value: subchild,
        });
      }
    });

    return entity;
  }

  private parsePerson(xml: HTMLElement): NamedEntity {
    const nameElement = xml.querySelector('name');
    const forenameElement = xml.querySelector('forename');
    const surnameElement = xml.querySelector('surname');
    let label = 'No info';
    if (forenameElement && surnameElement) {
      label = `${forenameElement.textContent} ${surnameElement.textContent}`.trim();
    } else if (nameElement) {
      label = nameElement.textContent.trim();
    }

    return {
      ...this.parseGenericEntity(xml),
      label,
    };
  }

  private parsePlace(xml: HTMLElement): NamedEntity {
    const placeNameElement = xml.querySelector('placeName');

    return {
      ...this.parseGenericEntity(xml),
      label: placeNameElement ? placeNameElement.textContent.trim() : 'No info',
    };
  }

  private parseOrganization(xml: HTMLElement): NamedEntity {
    const orgNameElement = xml.querySelector('orgName');

    return {
      ...this.parseGenericEntity(xml),
      label: orgNameElement ? orgNameElement.textContent.trim() : 'No info',
    };
  }

  private parseRelation(xml: HTMLElement): Relation {
    const active = xml.getAttribute('active') || '';
    const mutual = xml.getAttribute('mutual') || '';
    const passive = xml.getAttribute('passive') || '';
    const relation: Relation = {
      name: xml.getAttribute('name'),
      activeParts: active.replace(/#/g, '').split(' '),
      mutualParts: mutual.replace(/#/g, '').split(' '),
      passiveParts: passive.replace(/#/g, '').split(' '),
      description: xml.querySelector('desc') || xml.textContent,
      type: xml.getAttribute('type'),
      originalEncoding: xml,
    };
    const parentListEl = xml.parentElement.tagName === 'listRelation' ? xml.parentElement : undefined;
    if (parentListEl) {
      relation.type = `${(parentListEl.getAttribute('type') || '')} ${(relation.type || '')}`.trim();
    }

    return relation;
  }

  private getResultsByType(lists, entities, type) {
    return {
      lists: lists.filter(list => list.type === type),
      entities: entities.filter(entity => entity.type === type),
    };
  }
  /**
   * @todo: return tags depending on config
   */
  private getListsToParseTagName() {
    return 'listPerson, listPlace, listOrg';
  }
}
