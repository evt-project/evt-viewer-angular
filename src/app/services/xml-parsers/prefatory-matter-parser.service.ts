import { Injectable } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { EncodingDesc, FileDesc, ProfileDesc, ProjectInfo, RevisionDesc, XMLElement } from '../../models/evt-models';
import { EditionDataService } from '../edition-data.service';
import { queryAndParseElement } from './basic-parsers';

@Injectable({
  providedIn: 'root',
})
export class PrefatoryMatterParserService {
  public readonly title$ = this.editionDataService.parsedEditionSource$.pipe(
    map((source) => this.parseEditionTitle(source)),
    shareReplay(1),
  );

  public readonly projectInfo$ = this.editionDataService.parsedEditionSource$.pipe(
    map((source) => this.parseProjectInfo(source)),
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

  parseProjectInfo(source: XMLElement): ProjectInfo {
    return {
      fileDesc: queryAndParseElement<FileDesc>(source, 'fileDesc', true),
      encodingDesc: queryAndParseElement<EncodingDesc>(source, 'encodingDesc', true),
      profileDesc: queryAndParseElement<ProfileDesc>(source, 'profileDesc', true),
      revisionDesc: queryAndParseElement<RevisionDesc>(source, 'revisionDesc', true),
    };
  }
}
