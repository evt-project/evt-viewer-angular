import { Injectable } from '@angular/core';
import { ParserRegister } from '.';
import { QuoteEntry, XMLElement } from '../../models/evt-models';

@Injectable({
  providedIn: 'root',
})
export class QuoteEntriesParserService {

  public parseQuoteEntries(document: XMLElement) {
    const quoteParser = ParserRegister.get('evt-quote-entry-parser');

    return [
        Array.from(document.querySelectorAll<XMLElement>('quote'))
          .map((quoteEntry) => quoteParser.parse(quoteEntry) as QuoteEntry),
        Array.from(document.querySelectorAll<XMLElement>('cit'))
          .map((quoteEntry) => quoteParser.parse(quoteEntry) as QuoteEntry),
    ];
  }

}
