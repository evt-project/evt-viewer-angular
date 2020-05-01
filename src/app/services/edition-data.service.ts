import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, publishReplay, refCount, tap } from 'rxjs/operators';
import { AppConfig } from '../app.config';
import { OriginalEncodingNodeType, XMLElement } from '../models/evt-models';
import { parseXml } from '../utils/xml-utils';
import { NamedEntitiesParserService } from './xml-parsers/named-entities-parser.service';
import { StructureXmlParserService } from './xml-parsers/structure-xml-parser.service';

@Injectable({
  providedIn: 'root',
})
export class EditionDataService {
  private editionUrls = AppConfig.evtSettings.files.editionUrls || [];
  public parsedEditionSource$: Observable<OriginalEncodingNodeType> = this.loadAndParseEditionData();

  constructor(
    private http: HttpClient,
    private structureParser: StructureXmlParserService,
    private neParserService: NamedEntitiesParserService,
  ) {
  }

  private loadAndParseEditionData() {
    return this.http.get(this.editionUrls[0], { responseType: 'text' }).pipe(
      map(source => {
        let editionDoc: XMLElement;
        if (typeof source !== 'object' && typeof source === 'string') {
          editionDoc = parseXml(source);
        } else {
          editionDoc = source;
        }

        return editionDoc;
      }),
      tap(source => {
        this.structureParser.parsePages(source);
        this.neParserService.parseLists(source);
      }),
      publishReplay(1),
      refCount(),
      catchError(() => this.handleLoadingError()));
  }

  private handleLoadingError() {
    // TODO: TEMP
    const errorEl = document.createElement('div');
    if (!this.editionUrls || this.editionUrls.length === 0) {
      errorEl.textContent = 'Missing configuration for edition files. Data cannot be loaded.';
    } else {
      errorEl.textContent = 'There was an error in loading edition files.';
    }

    return of(errorEl);
  }
}
