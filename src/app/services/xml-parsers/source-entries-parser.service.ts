import { Injectable } from '@angular/core';
import { ParserRegister } from '.';
import { QuoteEntry, SourceClass, XMLElement } from '../../models/evt-models';

@Injectable({
  providedIn: 'root',
})
export class SourceEntriesParserService {
  public parseSourceEntries(document: XMLElement) {
    const quoteParser = ParserRegister.get('evt-quote-entry-parser');

    return [
      Array.from(document.querySelectorAll<XMLElement>(`.${SourceClass}`))
        .map((srcEntry) => quoteParser.parse(srcEntry) as QuoteEntry),
    ];
  }
}
