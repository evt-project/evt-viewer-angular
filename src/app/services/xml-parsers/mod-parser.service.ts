import { Injectable } from '@angular/core';
import { parse, ParserRegister } from '.';
import { ChangeLayerData, XMLElement } from '../../models/evt-models';
import { createParser } from './parser-models';
import { ListChangeParser } from './header-parser';

@Injectable({
  providedIn: 'root',
})
export class ModParserService {

  private tagName = `.mod`;
  private parserName = 'evt-mod-parser';

  public buildChangeList(xml: XMLElement): ChangeLayerData {

    const listChangeParser = createParser(ListChangeParser, parse);

    const list = xml.querySelectorAll<XMLElement>('listChange');
    const parsedList = Array.from(list).filter((el) => el).map((el) => listChangeParser.parse(el));
    let layerOrder = [];

    for(let i=0; i < parsedList.length-1; i++) {
      if (parsedList[i].ordered) {
        layerOrder = parsedList[i].content.map((change) => change.id);
      }
    }

    return {
      list: parsedList,
      layerOrder: layerOrder,
      selectedLayer: undefined,
    };
  }

  public parseModEntries(document: XMLElement) {
    const ModParser = ParserRegister.get(this.parserName);

    return Array.from(document.querySelectorAll<XMLElement>(this.tagName))
      .map((bib) => ModParser.parse(bib));
  }

}

