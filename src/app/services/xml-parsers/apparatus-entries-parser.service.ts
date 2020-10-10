import { Injectable } from '@angular/core';
import { parse } from '.';
import { ApparatusEntry, Reading, Witness, XMLElement } from '../../models/evt-models';
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

  public getSignificantReadings(apps: ApparatusEntry[]) {
    const signRdgs = {};
    apps.forEach((app) => {
      signRdgs[app.id] = app.readings.concat(app.lemma).filter((rdg: Reading) => rdg.significant);
    });

    return signRdgs;
  }

  public getSignificantReadingsNumber(signRdgs: { [key: string]: ApparatusEntry[] }) {
    const signRdgsNumber = {};
    Object.keys(signRdgs).forEach((app) => {
      signRdgsNumber[app] = signRdgs[app].length;
    });

    return signRdgsNumber;
  }

  public getAppVariance(signRdgsNum: { [key: string]: number }, witList: { [key: string]: Witness }) {
    const appsVariance = {};
    Object.keys(signRdgsNum).forEach((x) => {
      appsVariance[x] = signRdgsNum[x] / Object.keys(witList).length;
    });

    return appsVariance;
  }
}
