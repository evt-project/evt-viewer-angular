import { Injectable } from '@angular/core';
import { ParserRegister } from '.';
import { QuoteEntry, XMLElement } from '../../models/evt-models';

@Injectable({
  providedIn: 'root',
})
export class QuoteEntriesParserService {
  private quoteEntryTagName = 'quote';

  public parseQuoteEntries(document: XMLElement) {
    const quoteParser = ParserRegister.get('evt-quote-entry-parser');

    return Array.from(document.querySelectorAll<XMLElement>(this.quoteEntryTagName))
      .map((quoteEntry) => quoteParser.parse(quoteEntry) as QuoteEntry);
  }

}
