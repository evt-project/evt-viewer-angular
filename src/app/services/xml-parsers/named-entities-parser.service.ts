import { Injectable } from '@angular/core';
import { AttributesMap } from 'ng-dynamic-component';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AppConfig } from '../../app.config';
import { GenericElementComponent } from '../../components/generic-element/generic-element.component';
import {
  Description, NamedEntities, NamedEntitiesList, NamedEntity, NamedEntityInfo,
  NamedEntityLabel, NamedEntityType, Relation, XMLElement,
} from '../../models/evt-models';
import { isNestedInElem, xpath } from '../../utils/dom-utils';
import { replaceNewLines } from '../../utils/xml-utils';
import { EditionDataService } from '../edition-data.service';
import { GenericParserService } from './generic-parser.service';

@Injectable({
  providedIn: 'root',
})
export class NamedEntitiesParserService {
  public readonly parsedLists$ = this.editionDataService.parsedEditionSource$.pipe(
    map((source) => this.parseLists(source)),
    shareReplay(1),
  );

  public readonly persons$ = this.parsedLists$.pipe(
    map(({ lists, entities }) => (this.getResultsByType(lists, entities, ['person', 'personGrp']))),
  );

  public readonly places$ = this.parsedLists$.pipe(
    map(({ lists, entities }) => this.getResultsByType(lists, entities, ['place'])),
  );

  public readonly organizations$ = this.parsedLists$.pipe(
    map(({ lists, entities }) => this.getResultsByType(lists, entities, ['org'])),
  );

  public readonly relations$ = this.parsedLists$.pipe(
    map(({ relations }) => relations),
  );

  public readonly events$ = this.parsedLists$.pipe(
    map(({ lists, entities }) => this.getResultsByType(lists, entities, ['event'])),
  );

  public readonly namedEntities$: Observable<NamedEntities> = combineLatest([
    this.persons$,
    this.places$,
    this.organizations$,
    this.relations$,
    this.events$,
  ]).pipe(
    map(([persons, places, organizations, relations, events]) => ({
      persons,
      places,
      organizations,
      relations,
      events,
    })),
    shareReplay(1),
  );

  private neListsConfig = AppConfig.evtSettings.edition.namedEntitiesLists || {};
  private tagNamesMap: { [key: string]: string } = {
    persons: 'listPerson',
    places: 'listPlace',
    orgs: 'listOrg',
    relations: 'listRelation',
    events: 'listEvent',
  };

  constructor(
    private editionDataService: EditionDataService,
    private genericParserService: GenericParserService,
  ) {
  }

  private parseLists(document: XMLElement) {
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
      type: GenericElementComponent, // TODO: Set NamedEntitiesListComponent
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
            parsedList.relations.push(this.parseRelation(child));
            break;
          case 'listrelation':
            child.querySelectorAll<XMLElement>('relation').forEach(r => parsedList.relations.push(this.parseRelation(r)));
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
    const entity: NamedEntity = {
      type: GenericElementComponent, // TODO: Set NamedEntitiesComponent
      id: elId,
      originalEncoding: xml,
      label: replaceNewLines(xml.textContent) || 'No info',
      namedEntityType: this.getEntityType(xml.tagName),
      content: Array.from(xml.children).map((subchild: XMLElement) => this.parseEntityInfo(subchild)),
      attributes: this.parseAttributes(xml),
      occurrences: [],
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
      label += occupationElement ? `(${replaceNewLines(occupationElement.textContent)})` : '';
    } else if (nameElement) {
      label = replaceNewLines(nameElement.textContent) || 'No info';
    } else {
      label = replaceNewLines(xml.textContent) || 'No info';
    }

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
      name: xml.getAttribute('name'),
      activeParts: active.replace(/#/g, '').split(' '),
      mutualParts: mutual.replace(/#/g, '').split(' '),
      passiveParts: passive.replace(/#/g, '').split(' '),
      type: xml.getAttribute('type'),
      originalEncoding: xml,
    };
    if (descriptionEls && descriptionEls.length > 0) {
      relation.description = [];
      descriptionEls.forEach((el) => (relation.description as Description).push(this.genericParserService.parse(el)));
    } else {
      relation.description = (xml.textContent || '').trim();
    }
    const parentListEl = xml.parentElement.tagName === 'listRelation' ? xml.parentElement : undefined;
    if (parentListEl) {
      relation.type = `${(parentListEl.getAttribute('type') || '')} ${(relation.type || '')}`.trim();
    }

    return relation;
  }

  private parseEntityInfo(xml: XMLElement): NamedEntityInfo {
    if (xml.nodeType === 1 && xml.tagName.toLowerCase() === 'listplace') {
      return {
        type: GenericElementComponent, // TODO: Set NamedEntitiesListComponent
        label: xml.tagName.toLowerCase(),
        content: [this.parseList(xml)],
        attributes: this.parseAttributes(xml),
      };
    }

    return {
      type: GenericElementComponent, // TODO: Set ListItemInfoComponent
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

  private getResultsByType(lists: NamedEntitiesList[], entities: NamedEntity[], type: string[]) {
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
}
