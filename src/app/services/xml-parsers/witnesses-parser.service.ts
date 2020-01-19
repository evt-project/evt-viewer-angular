import { Injectable } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { Description, Witness, WitnessesList, WitnessGroup, XMLElement } from '../../models/evt-models';
import { isNestedInElem, xpath } from '../../utils/dom-utils';
import { replaceNotWordChar } from '../../utils/xml-utils';
import { EditionDataService } from '../edition-data.service';
import { GenericParserService } from './generic-parser.service';

@Injectable({
  providedIn: 'root',
})
export class WitnessesParserService {
  public readonly parsedList$ = this.editionDataService.parsedEditionSource$.pipe(
    map((source) => this.parseLists(source)),
    shareReplay(1),
  );

  private tagNamesMap: { [key: string]: string } = {
    witListTagName: 'listWit',
    witTagName: 'witness',
  };

  constructor(
    private editionDataService: EditionDataService,
    private genericParserService: GenericParserService,
  ) {
  }

  private parseLists(document: XMLElement): WitnessesList {
    const parsedList: WitnessesList = {
      witnesses: {},
      originalGroup: {},
      indexes: {
        witnesses: [],
        groups: [],
        encodingStructure: [],
      },
    };
    Array.from(document.querySelectorAll<XMLElement>(this.tagNamesMap.witListTagName))
      .map((list) => {
        !isNestedInElem(list, list.tagName) ? this.parseWitnesses(list, parsedList) : this.parseWitnessesGroups(list, parsedList);
      });

    return parsedList;
  }

  private parseWitnesses(list: XMLElement, parsedList: WitnessesList) {
    Array.from(list.querySelectorAll<XMLElement>(this.tagNamesMap.witTagName))
      .map((wit) => {
        const parsedWit = this.parseWitness(wit);
        parsedList.witnesses[parsedWit.id] = parsedWit;
        parsedList.indexes.witnesses.push(wit.getAttribute('xml:id'));
        if (parsedWit.group === undefined) {
          parsedList.indexes.encodingStructure.push(wit.getAttribute('xml:id'));
        }
        if (parsedWit.group && !parsedList.indexes.encodingStructure.includes(parsedWit.group)) {
          parsedList.indexes.encodingStructure.push(parsedWit.group);
        }
      });
  }

  private parseWitness(wit: XMLElement): Witness {
    return {
      id: wit.getAttribute('xml:id') || xpath(wit),
      attributes: this.genericParserService.parseAttributes(wit),
      content: this.parseWitnessContent(wit),
      group: this.parseParentGroupId(wit),
    };
  }

  private parseWitnessContent(wit: XMLElement): Description {
    const content = [];
    Array.from(wit.childNodes)
      .map((child: XMLElement) => content.push(this.genericParserService.parse(child)));

    return content;
  }

  private parseWitnessesGroups(list: XMLElement, parsedList: WitnessesList) {
    const parsedGroup = this.parseWitnessGroup(list);
    parsedList.originalGroup[parsedGroup.id] = parsedGroup;
    parsedList.indexes.groups.push(parsedGroup.id);
  }

  private parseWitnessGroup(list: XMLElement): WitnessGroup {
    return {
      id: list.getAttribute('xml:id') || xpath(list),
      name: this.parseGroupName(list) || replaceNotWordChar(list.getAttribute('xml:id')) || xpath(list),
      attributes: this.genericParserService.parseAttributes(list),
      content: this.parseGroupContent(list),
      group: this.parseParentGroupId(list) || undefined,
    };
  }

  private parseGroupName(list: XMLElement) {
    const groupTagName = 'head';
    const groupEl = Array.from(list.children)
      .find((child) => child.nodeName === groupTagName);

    return groupEl ? groupEl.textContent : undefined;
  }

  private parseGroupContent(list: XMLElement): Description {
    const content = [];
    Array.from(list.children)
      .filter(() => Object.keys(this.tagNamesMap))
      .map((child) => content.push(child.getAttribute('xml:id')));

    return content;
  }

  private parseParentGroupId(element: XMLElement) {
    const parentEl = element.parentElement;

    if (parentEl.tagName !== this.tagNamesMap.witListTagName) {
      this.parseParentGroupId(parentEl);
    }

    if (isNestedInElem(parentEl, parentEl.tagName)) {
      return parentEl.getAttribute('xml:id') || xpath(parentEl);
    }
  }
}
