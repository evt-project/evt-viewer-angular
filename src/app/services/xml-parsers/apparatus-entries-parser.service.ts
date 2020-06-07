import { Injectable } from '@angular/core';
import { parse } from '.';
import { XMLElement } from '../../models/evt-models';
import { AppParser } from './app-parser';
import { createParser } from './parser-models';

@Injectable({
  providedIn: 'root',
})
export class ApparatusEntriesParserService {
  private appEntryTagName = 'app';
  private appParser = createParser(AppParser, parse);

  public parseAppEntries(document: XMLElement) {
    return Array.from(document.querySelectorAll<XMLElement>(this.appEntryTagName))
      .map((appEntry) => this.appParser.parse(appEntry));
  }
}
