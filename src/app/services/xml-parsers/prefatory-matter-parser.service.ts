import { Injectable } from '@angular/core';
import { EncodingDesc, FileDesc, ProfileDesc, ProjectInfo, RevisionDesc, XMLElement } from '../../models/evt-models';
import { queryAndParseElement } from './basic-parsers';

@Injectable({
  providedIn: 'root',
})
export class PrefatoryMatterParserService {
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