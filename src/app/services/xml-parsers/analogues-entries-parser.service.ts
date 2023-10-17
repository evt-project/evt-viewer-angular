import { Injectable } from '@angular/core';
import { ParserRegister } from '.';
import { ParallelPassage, XMLElement } from '../../models/evt-models';

@Injectable({
  providedIn: 'root',
})
export class AnalogueEntriesParserService {

  private tagName = '.analogueEntry';
  private parserName = 'evt-analogue-entry-parser';

  public parseAnaloguesEntries(document: XMLElement) {

    const analogueParser = ParserRegister.get(this.parserName);

    return Array.from(document.querySelectorAll<XMLElement>(this.tagName))
      .map((analogue) => analogueParser.parse(analogue) as ParallelPassage);
  }

}

