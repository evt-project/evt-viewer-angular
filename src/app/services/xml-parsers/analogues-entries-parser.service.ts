import { Injectable } from '@angular/core';
import { ParserRegister } from '.';
import { ParallelPassage, XMLElement } from '../../models/evt-models';

@Injectable({
  providedIn: 'root',
})
export class AnalogueEntriesParserService {

  private refTagName = 'ref';
  private segTagName = 'seg';

  public parseAnaloguesEntries(document: XMLElement) {
    return this.parseRefEntries(document).concat(this.parseSegEntries(document));
  }

  public parseRefEntries(document: XMLElement) {
    const refParser = ParserRegister.get(this.refTagName);

    return Array.from(document.querySelectorAll<XMLElement>(this.refTagName))
      .map((refEntry) => refParser.parse(refEntry) as ParallelPassage);
  }

  public parseSegEntries(document: XMLElement) {
    const segParser = ParserRegister.get(this.segTagName);

    return Array.from(document.querySelectorAll<XMLElement>(this.segTagName))
      .map((segEntry) => segParser.parse(segEntry) as ParallelPassage);
  }

}
