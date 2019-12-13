import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageData, OriginalEncodingNodeType } from '../models/evt-models';
import { StructureXmlParserService } from './xml-parsers/structure-xml-parser.service';
import { map } from 'rxjs/operators';
import { EditionDataService } from './edition-data.service';

@Injectable({
  providedIn: 'root'
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
