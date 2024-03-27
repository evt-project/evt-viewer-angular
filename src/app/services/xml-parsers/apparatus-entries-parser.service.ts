import { Injectable } from '@angular/core';
import { ParserRegister } from '.';
import { ApparatusEntry, Reading, Witness, XMLElement } from '../../models/evt-models';

@Injectable({
  providedIn: 'root',
})
export class ApparatusEntriesParserService {
  private appEntryTagName = 'app';

  public parseAppEntries(document: XMLElement) {
    const appParser = ParserRegister.get('evt-apparatus-entry-parser');

    return Array.from(document.querySelectorAll<XMLElement>(this.appEntryTagName))
      .map((appEntry) => appParser.parse(appEntry) as ApparatusEntry);
  }

  public getSignificantReadings(apps: ApparatusEntry[]) {
    const signRdgs = {};
    apps.forEach((app) => {
      signRdgs[app.id] = app.readings.concat(app.lemma).filter((rdg: Reading) => rdg?.significant);
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

  public getAppVariance(signRdgsNum: { [key: string]: number }, witList: Witness[]) {
    const appsVariance = {};
    if (Object.keys(witList).length > 1) {
      Object.keys(signRdgsNum).forEach((x) => {
        appsVariance[x] = signRdgsNum[x] / Object.keys(witList).length;
      });
    }

    return appsVariance;
  }
}
