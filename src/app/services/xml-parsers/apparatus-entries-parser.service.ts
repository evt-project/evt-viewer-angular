import { Injectable } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { AppConfig } from '../../../app/app.config';
import { ApparatusEntries, ApparatusEntry, Lemma, Reading, XMLElement } from '../../models/evt-models';
import { getOuterHTML, xpath } from '../../utils/dom-utils';
import { removeSpaces } from '../../utils/xml-utils';
import { EditionDataService } from '../edition-data.service';

@Injectable({
  providedIn: 'root',
})
export class ApparatusEntriesParserService {
  public readonly appEntries$ = this.editionDataService.parsedEditionSource$.pipe(
    map((source) => this.parseAppEntriesList(source)),
    shareReplay(1),
  );

  private appEntryTagName = 'app';
  private readingGroupTagName = 'rdgGrp';
  private noteTagName = 'note';

  constructor(
    private editionDataService: EditionDataService,
  ) {
  }

  private parseAppEntriesList(document: XMLElement): ApparatusEntries {
    const appEntries = Array.from(document.querySelectorAll<XMLElement>(this.appEntryTagName));

    return this.parseAppEntries(appEntries);
  }

  private parseAppEntries(appEntries: XMLElement[]) {
    return appEntries.map((appEntry) => this.parseAppEntry(appEntry));
  }

  public parseAppEntry(appEntry: XMLElement): ApparatusEntry {

    return {
      type: 'ApparatusEntryComponent',
      id: appEntry.getAttribute('xml:id') || xpath(appEntry),
      attributes: {},
      content: [],
      notes: [],
      variance: 0,
      originalEncoding: getOuterHTML(appEntry),
    };
  }

  public parseLemma(rdg: XMLElement): Lemma {
    return {
      type: 'LemmaComponent',
      id: rdg.getAttribute('xml:id') || xpath(rdg),
      attributes: {},
      witIDs: this.parseReadingWitnesses(rdg) || [],
      content: [],
      significant: true,
    };
  }

  public parseReading(rdg: XMLElement): Reading {
    return {
      type: 'ReadingComponent',
      id: rdg.getAttribute('xml:id') || xpath(rdg),
      attributes: {},
      witIDs: this.parseReadingWitnesses(rdg) || [],
      content: [],
      significant: this.readingIsSignificant(rdg),
    };
  }

  private parseReadingWitnesses(rdg: XMLElement) {
    return rdg.getAttribute('wit')?.split('#')
      .map((el) => removeSpaces(el))
      .filter((el) => el.length !== 0);
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

  public getAppNotes(xml: XMLElement) {
    return Array.from(xml.children)
      .filter(({tagName}) => tagName === this.noteTagName);
  }
}
