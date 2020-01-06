import { Injectable } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { Witness, WitnessesList, XMLElement } from 'src/app/models/evt-models';
import { isNestedInElem, xpath } from 'src/app/utils/dom-utils';
import { parseAttributes } from '../../utils/xml-utils';
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

  constructor(
    private editionDataService: EditionDataService,
    private genericParserService: GenericParserService,
  ) {
  }

  private parseLists(document: XMLElement): WitnessesList {
    const witListTagName = 'listWit';
    const lists = document.querySelectorAll<XMLElement>(witListTagName);
    const parsedList: WitnessesList = {
      witnesses: {},
    };
    lists.forEach((list) => {
      if (!isNestedInElem(list, list.tagName)) {
        this.parseWitnesses(list, parsedList);
      }
    });

    return parsedList;
  }

  private parseWitnesses(list: XMLElement, parsedList: WitnessesList) {
    const witTagName = 'witness';
    const witnesses = list.querySelectorAll<XMLElement>(witTagName);
    witnesses.forEach((wit) => {
      const parsedWit = this.parseWitness(wit);
      parsedList.witnesses[parsedWit.id] = parsedWit;
    });

    return parsedList;
  }

  private parseWitness(wit: XMLElement): Witness {
    const witness = {
      id: wit.getAttribute('xml:id') || xpath(wit),
      attributes: parseAttributes(wit),
      content: this.parseWitnessContent(wit),
    };

    return witness;
  }

  private parseWitnessContent(wit: XMLElement) {
    const contents = [];
    wit.childNodes.forEach((child: XMLElement) => {
      const content = this.genericParserService.parse(child);
      contents.push(content);
    });

    return contents;
  }
}
