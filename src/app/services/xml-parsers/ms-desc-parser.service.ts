import { Injectable } from '@angular/core';
import { parse } from '.';
import { MsDesc, XMLElement } from '../../models/evt-models';
import { MsDescParser } from './msdesc-parser';
import { createParser } from './parser-models';

@Injectable({
  providedIn: 'root',
})
export class MsDescParserService {
  private msDescParser = createParser(MsDescParser, parse);

  parseMsDesc(xml: XMLElement): MsDesc[] {

    return Array.from(xml.querySelectorAll<XMLElement>('msDesc')).map(s => this.msDescParser.parse(s));
  }

}
