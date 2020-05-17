import { Injectable } from '@angular/core';
import { Description, Witness, WitnessesData, WitnessGroup, XMLElement } from '../../models/evt-models';
import { isNestedInElem, xpath } from '../../utils/dom-utils';
import { arrayToMap } from '../../utils/js-utils';
import { replaceNotWordChar } from '../../utils/xml-utils';
import { GenericParserService } from './generic-parser.service';

@Injectable({
  providedIn: 'root',
})
export class WitnessesParserService {
  private witListTagName = 'listWit';
  private witTagName = 'witness';
  private witNameAttr = 'type="siglum"';
  private groupTagName = 'head';

  constructor(
    private genericParserService: GenericParserService,
  ) {
  }

  public parseWitnessesData(document: XMLElement): WitnessesData {
    const lists = Array.from(document.querySelectorAll<XMLElement>(this.witListTagName));

    return {
      witnesses: this.parseWitnessesList(lists),
      groups: this.parseWitnessesGroups(lists),
    };
  }

  private parseWitnessesList(lists: XMLElement[]) {
    const parsedList = lists.filter((list) => !isNestedInElem(list, list.tagName))
      .map((list) => this.parseWitnesses(list))
      .reduce((x, y) => x.concat(y), []);

    return arrayToMap(parsedList, 'id');
  }

  private parseWitnesses(list: XMLElement) {
    return Array.from(list.querySelectorAll<XMLElement>(this.witTagName))
      .map((wit) => this.parseWitness(wit));
  }

  private parseWitness(wit: XMLElement): Witness {
    return {
      id: wit.getAttribute('xml:id') || xpath(wit),
      name: this.parseWitnessName(wit) || wit.getAttribute('xml:id') || xpath(wit),
      attributes: this.genericParserService.parseAttributes(wit),
      content: this.parseWitnessContent(wit),
      groupId: this.parseParentGroupId(wit),
    };
  }

  private parseWitnessName(wit: XMLElement) {
    // TODO use ‘?’ operator after update tu angular 9
    const witNameEl = wit.querySelector<XMLElement>(`*[${this.witNameAttr}]`);

    if (witNameEl) {
      return Array.from(witNameEl.childNodes)
        .map((child: XMLElement) => this.genericParserService.parse(child));
    }

    return witNameEl;
  }

  private parseWitnessContent(wit: XMLElement): Description {
    return Array.from(wit.childNodes)
      .filter((child) => child.nodeName !== this.witListTagName && child.textContent.trim().length !== 0)
      .map((child: XMLElement) => this.genericParserService.parse(child));
  }

  private parseWitnessesGroups(lists: XMLElement[]) {
    const parsedGroups = lists.filter((list) => isNestedInElem(list, list.tagName))
      .map((list) => this.parseWitnessGroup(list));

    return arrayToMap(parsedGroups, 'id');
  }

  private parseWitnessGroup(list: XMLElement): WitnessGroup {
    return {
      id: list.getAttribute('xml:id') || xpath(list),
      name: this.parseGroupName(list) || replaceNotWordChar(list.getAttribute('xml:id')) || xpath(list),
      attributes: this.genericParserService.parseAttributes(list),
      witnesses: this.parseGroupWitnesses(list),
      groupId: this.parseParentGroupId(list),
    };
  }

  private parseGroupName(list: XMLElement) {
    const groupEl = Array.from(list.children)
      .find((child) => child.nodeName === this.groupTagName);

    return groupEl && groupEl.textContent;
  }

  private parseGroupWitnesses(list: XMLElement) {
    return Array.from(list.children)
      .filter(({nodeName}) => nodeName === this.witListTagName || nodeName === this.witTagName)
      .map((child) => child.getAttribute('xml:id'));
  }

  private parseParentGroupId(element: XMLElement) {
    let parentEl = element.parentElement;

    do {
      if (isNestedInElem(parentEl, this.witListTagName) && parentEl.tagName === this.witListTagName) {
        return parentEl.getAttribute('xml:id') || xpath(parentEl);
      }
      parentEl = parentEl.parentElement;
    } while (parentEl.matches(this.witListTagName));
  }
}
