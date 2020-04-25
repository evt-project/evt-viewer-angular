import { Injectable } from '@angular/core';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { AppConfig } from '../../../app/app.config';
import { ApparatusEntriesList, ApparatusEntry, Lemma, Reading, XMLElement } from '../../models/evt-models';
import { NoteData } from '../../models/parsed-elements';
import { getOuterHTML, xpath } from '../../utils/dom-utils';
import { arrayToMap } from '../../utils/js-utils';
import { removeSpaces } from '../../utils/xml-utils';
import { EditionDataService } from '../edition-data.service';
import { GenericParserService } from './generic-parser.service';
import { WitnessesParserService } from './witnesses-parser.service';

@Injectable({
  providedIn: 'root',
})
export class ApparatusEntriesParserService {
  private witnessesNumber$ = this.witParserService.witnesses$.pipe(
    map((x) => Object.keys(x).length),
  );

  public readonly appEntries$ = this.witnessesNumber$.pipe(
    switchMap((n) => this.editionDataService.parsedEditionSource$.pipe(
      map((source) => this.parseAppEntriesList(source, n)),
      shareReplay(1),
    )),
  );

  private appEntryTagName = 'app';
  private lemmaTagName = 'lem';
  private readingTagName = 'rdg';
  private readingGroupTagName = 'rdgGrp';
  private noteTagName = 'note';

  constructor(
    private editionDataService: EditionDataService,
    private genericParserService: GenericParserService,
    private witParserService: WitnessesParserService,
  ) {
  }

  private parseAppEntriesList(document: XMLElement, witsNumber: number): ApparatusEntriesList {
    const appEntries = Array.from(document.querySelectorAll<XMLElement>(this.appEntryTagName));

    return this.parseAppEntries(appEntries, witsNumber);
  }

  private parseAppEntries(appEntries: XMLElement[], witsNumber: number) {
    const parsedEntries = appEntries.map((appEntry) => this.parseAppEntry(appEntry, witsNumber));

    return arrayToMap(parsedEntries, 'id');
  }

  private parseAppEntry(appEntry: XMLElement, witsNumber: number): ApparatusEntry {
    const content = this.parseAppReadings(appEntry);

    return {
      type: 'ApparatusEntryComponent',
      id: appEntry.getAttribute('xml:id') || xpath(appEntry),
      attributes: this.genericParserService.parseAttributes(appEntry),
      content,
      notes: this.parseAppNotes(appEntry),
      variance: this.calcVariance(content, witsNumber),
      originalEncoding: getOuterHTML(appEntry),
    };
  }

  private parseAppReadings(appEntry: XMLElement): Array<Lemma | Reading> {
    return Array.from(appEntry.querySelectorAll(`${this.lemmaTagName}, ${this.readingTagName}`))
      .map((rdg: XMLElement) => {
        return rdg.tagName === this.lemmaTagName ? this.parseLemma(rdg) : this.parseReading(rdg);
      });
  }

  private parseLemma(rdg: XMLElement): Lemma {
    return {
      type: 'LemmaComponent',
      id: rdg.getAttribute('xml:id') || xpath(rdg),
      attributes: this.genericParserService.parseAttributes(rdg),
      witIDs: this.parseReadingWitnesses(rdg) || [],
      content: this.parseAppReadingContent(rdg),
      significant: true,
    };
  }

  private parseReading(rdg: XMLElement): Reading {
    return {
      type: 'ReadingComponent',
      id: rdg.getAttribute('xml:id') || xpath(rdg),
      attributes: this.genericParserService.parseAttributes(rdg),
      witIDs: this.parseReadingWitnesses(rdg) || [],
      content: this.parseAppReadingContent(rdg),
      significant: this.readingIsSignificant(rdg),
    };
  }

  private parseReadingWitnesses(rdg: XMLElement) {
    return rdg.getAttribute('wit')?.split('#')
      .map((el) => removeSpaces(el))
      .filter((el) => el.length !== 0);
  }

  private parseAppReadingContent(rdg: XMLElement) {
    return Array.from(rdg.childNodes)
      .map((child: XMLElement) => {
        if (child.nodeName === this.appEntryTagName) {
          return {
            type: 'ApparatusEntryComponent',
            id: child.getAttribute('xml:id') || xpath(child),
            attributes: {},
            content: [],
          };
        }

        return this.genericParserService.parse(child);
      });
  }

  private readingIsSignificant(rdg: XMLElement): boolean {
    const notSignificantReadings = AppConfig.evtSettings.edition.notSignificantVariants;
    let isSignificant = true;

    if (notSignificantReadings.length > 0) {
      isSignificant = this.isSignificant(notSignificantReadings, rdg.attributes);
      if (isSignificant && rdg.parentElement.tagName === this.readingGroupTagName) {
        isSignificant = this.isSignificant(notSignificantReadings, rdg.parentElement.attributes);
      }
    }

    return isSignificant;
  }

  private isSignificant(notSignificantReading: string[], attributes: NamedNodeMap): boolean {
    return !Array.from(attributes).some(({name, value}) => {
      return notSignificantReading.includes(`${name}=${value}`);
    });
  }

  private parseAppNotes(appEntry: XMLElement): NoteData[] {
    const notes  = Array.from(appEntry.children)
      .filter(({tagName}) => tagName === this.noteTagName)
      .map((note: XMLElement) => this.genericParserService.parse(note));

    return notes as NoteData[];
  }

  private calcVariance(appEntryReadings: Array<Lemma | Reading>, witsNumber: number): number {
    return this.getAppSignificantRdgNumber(appEntryReadings) / witsNumber;
  }

  private getAppSignificantRdgNumber(appEntryReadings: Array<Lemma | Reading>): number {
    return appEntryReadings.filter(({significant}) => significant).length;
  }
}
