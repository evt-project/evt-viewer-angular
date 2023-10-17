import { Injectable } from '@angular/core';
import { ParserRegister } from '.';
import { BibliographyClass, XMLElement } from '../../models/evt-models';

@Injectable({
  providedIn: 'root',
})
export class BibliographicEntriesParserService {

  private tagName = `.${BibliographyClass}`;
  private parserName = 'evt-bibliographic-entry-parser';

  public parseAnaloguesEntries(document: XMLElement) {

    const bibliographicParser = ParserRegister.get(this.parserName);

    return Array.from(document.querySelectorAll<XMLElement>(this.tagName))
      .map((bib) => bibliographicParser.parse(bib));
  }

}

