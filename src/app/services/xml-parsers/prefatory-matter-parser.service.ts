import { Injectable } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { XMLElement } from '../../models/evt-models';
import { EditionDataService } from '../edition-data.service';

@Injectable({
  providedIn: 'root',
})
export class PrefatoryMatterParserService {
  public readonly title$ = this.editionDataService.parsedEditionSource$.pipe(
    map((source) => this.parseEditionTitle(source)),
    shareReplay(1),
  );

  constructor(
    private editionDataService: EditionDataService,
  ) {
  }

  parseEditionTitle(source: XMLElement) {
    const titleElems = source.querySelectorAll('titleStmt title');

    return titleElems[0]?.textContent;
  }
}
