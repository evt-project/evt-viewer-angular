import { Injectable } from '@angular/core';
import { AppConfig } from '../../../app/app.config';
import { ApparatusEntry, Reading, XMLElement } from '../../models/evt-models';
import { getOuterHTML, xpath } from '../../utils/dom-utils';
import { removeSpaces } from '../../utils/xml-utils';

@Injectable({
  providedIn: 'root',
})
export class ApparatusEntriesParserService {
  private appEntryTagName = 'app';
  private readingGroupTagName = 'rdgGrp';
  private noteTagName = 'note';

  public parseAppEntries(document: XMLElement) {
    const appEntries = Array.from(document.querySelectorAll<XMLElement>(this.appEntryTagName));

    return appEntries.map((appEntry) => this.parseAppEntry(appEntry));
  }

  public parseAppEntry(appEntry: XMLElement): ApparatusEntry {
    return {
      type: ApparatusEntry,
      id: appEntry.getAttribute('xml:id') || xpath(appEntry),
      attributes: {},
      content: [],
      notes: [],
      variance: 0,
      originalEncoding: getOuterHTML(appEntry),
    };
  }

  public parseReading(rdg: XMLElement): Reading {
    return {
      type: Reading,
      id: rdg.getAttribute('xml:id') || xpath(rdg),
      attributes: {},
      witIDs: this.parseReadingWitnesses(rdg) || [],
      content: [],
      significant: this.readingIsSignificant(rdg),
    };
  }

  public parseLemma(rdg: XMLElement): Reading {
    return {
      ...this.parseReading(rdg),
      significant: true,
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
