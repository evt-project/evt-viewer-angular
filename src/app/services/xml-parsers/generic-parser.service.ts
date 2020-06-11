import { Injectable } from '@angular/core';
import { parse } from '.';
import { XMLElement } from '../../models/evt-models';

@Injectable()
export class GenericParserService {
  parse(xml: XMLElement) { return parse(xml); }
}
