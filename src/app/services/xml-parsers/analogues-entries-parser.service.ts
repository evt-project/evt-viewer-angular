import { Injectable } from '@angular/core';
import { ParserRegister } from '.';
import { Analogue, AnalogueClass, XMLElement } from '../../models/evt-models';

@Injectable({
  providedIn: 'root',
})
export class AnalogueEntriesParserService {

  private tagName = `.${AnalogueClass}`;
  private parserName = 'evt-analogue-entry-parser';

  public parseAnaloguesEntries(document: XMLElement) {

    const analogueParser = ParserRegister.get(this.parserName);

    return Array.from(document.querySelectorAll<XMLElement>(this.tagName))
      .map((analogue) => analogueParser.parse(analogue) as Analogue);
  }

}

