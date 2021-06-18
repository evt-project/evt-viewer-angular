import { Injectable } from '@angular/core';
import { parse } from '.';
import { MsDesc, XMLElement } from '../../models/evt-models';
import { MsDescParser } from './msdesc-parser';
import { createParser } from './parser-models';

@Injectable({
  providedIn: 'root',
})
export class MsDescParserService {

  parseMsDesc(xml: XMLElement): MsDesc[] {
    if (!xml) { return []; }

    return Array.from(xml.querySelectorAll<XMLElement>('msDesc')).map(ms => {
      const msDesc = ms.querySelector<HTMLElement>('msDesc');
      const msDescParser = createParser(MsDescParser, parse);

      return msDescParser.parse(msDesc);
    });
}}
