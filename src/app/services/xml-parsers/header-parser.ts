import { isNestedInElem } from 'src/app/utils/dom-utils';
import { FileDesc, XMLElement } from '../../models/evt-models';
import { GenericElemParser } from './basic-parsers';
import { getClass, parseChildren, Parser } from './parser-models';

export class FileDescParser extends GenericElemParser implements Parser<XMLElement> {
  private excludeFromParsing = [
    'listBibl',
    'listEvent',
    'listOrg',
    'listPerson',
    'listPlace',
    'listWit',
    'sourceDesc list',
  ];

  parse(xml: XMLElement): FileDesc {
    xml = xml.cloneNode(true) as XMLElement;
    Array.from(xml.querySelectorAll<XMLElement>(this.excludeFromParsing.toString()))
      .filter((list) => !isNestedInElem(list, list.tagName))
      .forEach(el => el.remove());

    const titleStmtEl = xml.querySelector<XMLElement>(':scope > titleStmt');
    const editionStmtEl = xml.querySelector<XMLElement>(':scope > editionStmt');
    const extentEl = xml.querySelector<XMLElement>(':scope > extent');
    const publicationStmtEl = xml.querySelector<XMLElement>(':scope > publicationStmt');
    const notesStmtEl = xml.querySelector<XMLElement>('notesStmt');
    const seriesStmtEl = xml.querySelector<XMLElement>('seriesStmt');
    const sourceDescEl = xml.querySelector<XMLElement>('sourceDesc');

    return {
      type: FileDesc,
      class: getClass(xml),
      content: parseChildren(xml, this.genericParse),
      attributes: this.attributeParser.parse(xml),
      titleStmt: titleStmtEl ? parseChildren(titleStmtEl, this.genericParse) : [],
      editionStmt: editionStmtEl ? parseChildren(editionStmtEl, this.genericParse) : [],
      publicationStmt: publicationStmtEl ? parseChildren(publicationStmtEl, this.genericParse) : [],
      sourceDesc: sourceDescEl ? parseChildren(sourceDescEl, this.genericParse) : [],
      extent: extentEl ? parseChildren(extentEl, this.genericParse) : [],
      notesStmt: notesStmtEl ? parseChildren(notesStmtEl, this.genericParse) : [],
      seriesStmt: seriesStmtEl ? parseChildren(seriesStmtEl, this.genericParse) : [],
    };
  }
}
