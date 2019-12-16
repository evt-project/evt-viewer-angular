import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OriginalEncodingNodeType, PageData } from '../models/evt-models';
import { EditionDataService } from './edition-data.service';
import { StructureXmlParserService } from './xml-parsers/structure-xml-parser.service';

@Injectable({
  providedIn: 'root',
})
export class EVTModelService {

  constructor(
    private editionDataService: EditionDataService,
    private editionStructure: StructureXmlParserService,
  ) {
  }

  getEditionSource(): Observable<OriginalEncodingNodeType> {
    return this.editionDataService.parsedEditionSource$;
  }

  getPages(): Observable<PageData[]> {
    return this.editionStructure.getPages();
  }

  getPage(pageId: string): Observable<PageData> {
    return this.editionStructure.getPages().pipe(map((pages) => pages.find((page) => page.id === pageId)));
  }
}
