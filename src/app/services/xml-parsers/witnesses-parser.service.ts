import { Injectable } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { Description, Witness, WitnessesList, XMLElement } from '../../models/evt-models';
import { isNestedInElem, xpath } from '../../utils/dom-utils';
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
  private witTagName = 'witness';

  constructor(
    private editionDataService: EditionDataService,
    private genericParserService: GenericParserService,
  ) {
  }

  private parseLists(document: XMLElement): WitnessesList {
    const witListTagName = 'listWit';
    const parsedList: WitnessesList = {
      witnesses: {},
    };
    Array.from(document.querySelectorAll<XMLElement>(witListTagName))
      .map((list) => {
        if (!isNestedInElem(list, list.tagName)) {
          this.parseWitnesses(list, parsedList);
        }
      });

    return parsedList;
  }

  private parseWitnesses(list: XMLElement, parsedList: WitnessesList): WitnessesList {
    Array.from(list.querySelectorAll<XMLElement>(this.witTagName))
      .map((wit) => {
        const parsedWit = this.parseWitness(wit);
        parsedList.witnesses[parsedWit.id] = parsedWit;
      });

    return parsedList;
  }

  private parseWitness(wit: XMLElement): Witness {
    const witness = {
      id: wit.getAttribute('xml:id') || xpath(wit),
      attributes: this.genericParserService.parseAttributes(wit),
      content: this.parseWitnessContent(wit),
    };

    return witness;
  }

  private parseWitnessContent(wit: XMLElement): Description {
    const contents = [];
    Array.from(wit.childNodes)
      .map((child: XMLElement) => contents.push(this.genericParserService.parse(child)));

    return contents;
  }
}
