import { Injectable } from '@angular/core';
import { XMLElement } from '../../models/evt-models';
import { parse } from '.';

@Injectable()
export class GenericParserService {
  parse(xml: XMLElement) { return parse(xml); }
}
