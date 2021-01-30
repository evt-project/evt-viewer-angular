import { isNestedInElem } from 'src/app/utils/dom-utils';
import {
  EditionStmt, FileDesc, GenericElement, NamedEntityRef, Note,
  PublicationStmt, Resp, RespStmt, TitleStmt, XMLElement,
} from '../../models/evt-models';
import { GenericElemParser, NoteParser, queryAndParseElement, queryAndParseElements } from './basic-parsers';
import { NamedEntityRefParser } from './named-entity-parsers';
import { createParser, getClass, parseChildren, Parser } from './parser-models';

export class RespParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Resp {
    const attributes = this.attributeParser.parse(xml);
    const { ref, when } = attributes;
    const normalizedResp = ref?.indexOf('http://') < 0 && ref?.indexOf('https://') < 0 ? `http://${ref}` : ref ?? '';

    return {
      type: Resp,
      class: getClass(xml),
      content: parseChildren(xml, this.genericParse, true),
      attributes,
      normalizedResp,
      date: when || '',
    };
  }
}

export class RespStmtParser extends GenericElemParser implements Parser<XMLElement> {
  private noteParser = createParser(NoteParser, this.genericParse);
  private respParser = createParser(RespParser, this.genericParse);
  private namedEntityRefParser = createParser(NamedEntityRefParser, this.genericParse);

  parse(xml: XMLElement): RespStmt {
    const people = Array.from(xml.querySelectorAll<XMLElement>(':scope > name, :scope > orgName, :scope > persName'))
      .map(p => {
        if (['orgName', 'persName'].includes(p.tagName)) {
          return this.namedEntityRefParser.parse(p) as NamedEntityRef;
        }

        return this.genericParse(p) as GenericElement;
      });

    return {
      type: RespStmt,
      class: getClass(xml),
      content: parseChildren(xml, this.genericParse, true),
      attributes: this.attributeParser.parse(xml),
      responsibility: queryAndParseElement<Resp>(xml, 'resp', this.respParser),
      notes: queryAndParseElements<Note>(xml, 'note', this.noteParser),
      people,
    };
  }
}

export class TitleStmtParser extends GenericElemParser implements Parser<XMLElement> {
  private genericElemParser = createParser(GenericElemParser, this.genericParse);
  private respStmtParser = createParser(RespStmtParser, this.genericParse);

  parse(xml: XMLElement): TitleStmt {
    const title = queryAndParseElements<GenericElement>(xml, 'title[type="main"]', this.genericElemParser);

    return {
      type: TitleStmt,
      class: getClass(xml),
      content: parseChildren(xml, this.genericParse),
      attributes: this.attributeParser.parse(xml),
      titles: title.length > 0 ? title : queryAndParseElements<GenericElement>(xml, 'title:not([type="sub"])', this.genericElemParser),
      subtitles: queryAndParseElements<GenericElement>(xml, 'title[type="sub"]', this.genericElemParser),
      authors: queryAndParseElements<GenericElement>(xml, 'author', this.genericElemParser),
      editors: queryAndParseElements<GenericElement>(xml, 'editor', this.genericElemParser),
      sponsors: queryAndParseElements<GenericElement>(xml, 'sponsor', this.genericElemParser),
      funders: queryAndParseElements<GenericElement>(xml, 'funder', this.genericElemParser),
      principals: queryAndParseElements<GenericElement>(xml, 'principal', this.genericElemParser),
      respStmts: queryAndParseElements<RespStmt>(xml, 'respStmt', this.respStmtParser),
    };
  }
}

export class EditionStmtParser extends GenericElemParser implements Parser<XMLElement> {
  private genericElemParser = createParser(GenericElemParser, this.genericParse);
  private respStmtParser = createParser(RespStmtParser, this.genericParse);

  parse(xml: XMLElement): EditionStmt {
    return {
      type: EditionStmt,
      class: getClass(xml),
      content: parseChildren(xml, this.genericParse),
      attributes: this.attributeParser.parse(xml),
      edition: queryAndParseElements<GenericElement>(xml, 'edition', this.genericElemParser),
      respStmt: queryAndParseElements<RespStmt>(xml, 'respStmt', this.respStmtParser),
      structuredData: Array.from(xml.children).filter(el => el.tagName === 'p').length !== xml.children.length,
    };
  }
}

export class PublicationStmtParser extends GenericElemParser implements Parser<XMLElement> {
  private genericElemParser = createParser(GenericElemParser, this.genericParse);

  parse(xml: XMLElement): PublicationStmt {
    return {
      type: PublicationStmt,
      class: getClass(xml),
      content: parseChildren(xml, this.genericParse, true),
      attributes: this.attributeParser.parse(xml),
      structuredData: Array.from(xml.children).filter(el => el.tagName === 'p').length !== xml.children.length,
      publisher: queryAndParseElements<GenericElement>(xml, 'publisher', this.genericElemParser),
      distributor: queryAndParseElements<GenericElement>(xml, 'distributor', this.genericElemParser),
      authority: queryAndParseElements<GenericElement>(xml, 'authority', this.genericElemParser),
      pubPlace: queryAndParseElements<GenericElement>(xml, 'pubPlace', this.genericElemParser),
      address: queryAndParseElements<GenericElement>(xml, 'address', this.genericElemParser),
      idno: queryAndParseElements<GenericElement>(xml, 'idno', this.genericElemParser),
      availability: queryAndParseElements<GenericElement>(xml, 'availability', this.genericElemParser),
      date: queryAndParseElements<GenericElement>(xml, 'date', this.genericElemParser),
      licence: queryAndParseElements<GenericElement>(xml, 'licence', this.genericElemParser),
    };
  }
}

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
  private genericElemParser = createParser(GenericElemParser, this.genericParse);
  private titleStmtParser = createParser(TitleStmtParser, this.genericParse);
  private editionStmtParser = createParser(EditionStmtParser, this.genericParse);
  private publicationStmtParser = createParser(PublicationStmtParser, this.genericParse);

  parse(xml: XMLElement): FileDesc {
    xml = xml.cloneNode(true) as XMLElement;
    Array.from(xml.querySelectorAll<XMLElement>(this.excludeFromParsing.toString()))
      .filter((list) => !isNestedInElem(list, list.tagName))
      .forEach(el => el.remove());

    return {
      type: FileDesc,
      class: getClass(xml),
      content: parseChildren(xml, this.genericParse),
      attributes: this.attributeParser.parse(xml),
      titleStmt: queryAndParseElement<TitleStmt>(xml, 'titleStmt', this.titleStmtParser),
      editionStmt: queryAndParseElement<EditionStmt>(xml, 'editionStmt', this.editionStmtParser),
      publicationStmt: queryAndParseElement<PublicationStmt>(xml, 'publicationStmt', this.publicationStmtParser),
      sourceDesc: queryAndParseElements<GenericElement>(xml, 'sourceDesc', this.genericElemParser),
      extent: queryAndParseElements<GenericElement>(xml, 'extent', this.genericElemParser),
      notesStmt: queryAndParseElements<GenericElement>(xml, 'notesStmt', this.genericElemParser),
      seriesStmt: queryAndParseElements<GenericElement>(xml, 'seriesStmt', this.genericElemParser),
    };
  }
}
