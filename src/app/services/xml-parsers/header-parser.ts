import { isNestedInElem } from 'src/app/utils/dom-utils';
import {
  EditionStmt, Extent, FileDesc, GenericElement, MsDesc, NamedEntityRef, Note,
  NotesStmt, PublicationStmt, Resp, RespStmt, SeriesStmt, SourceDesc, TitleStmt, XMLElement,
} from '../../models/evt-models';
import { GenericElemParser, NoteParser, queryAndParseElement, queryAndParseElements } from './basic-parsers';
import { MsDescParser } from './msdesc-parser';
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

export class SeriesStmtParser extends GenericElemParser implements Parser<XMLElement> {
  private genericElemParser = createParser(GenericElemParser, this.genericParse);
  private respStmtParser = createParser(RespStmtParser, this.genericParse);

  parse(xml: XMLElement): SeriesStmt {
    return {
      type: SeriesStmt,
      class: getClass(xml),
      content: parseChildren(xml, this.genericParse, true),
      attributes: this.attributeParser.parse(xml),
      structuredData: Array.from(xml.querySelectorAll(':scope > p')).length === 0,
      title: queryAndParseElements<GenericElement>(xml, 'title', this.genericElemParser),
      idno: queryAndParseElements<GenericElement>(xml, 'idno', this.genericElemParser),
      respStmt: queryAndParseElements<RespStmt>(xml, 'respStmt', this.respStmtParser),
      editor: queryAndParseElements<GenericElement>(xml, 'editor', this.genericElemParser),
      biblScope: queryAndParseElements<GenericElement>(xml, 'biblScope', this.genericElemParser),
    };
  }
}

export class NotesStmtParser extends GenericElemParser implements Parser<XMLElement> {
  private genericElemParser = createParser(GenericElemParser, this.genericParse);
  private notesStmt = createParser(NoteParser, this.genericParse);

  parse(xml: XMLElement): NotesStmt {
    return {
      type: NotesStmt,
      class: getClass(xml),
      content: parseChildren(xml, this.genericParse, true),
      attributes: this.attributeParser.parse(xml),
      notes: queryAndParseElements<Note>(xml, 'note', this.notesStmt),
      relatedItems: queryAndParseElements<GenericElement>(xml, 'relatedItem', this.genericElemParser),
    };
  }
}

export class SourceDescParser extends GenericElemParser implements Parser<XMLElement> {
  private genericElemParser = createParser(GenericElemParser, this.genericParse);
  private msDescParser = createParser(MsDescParser, this.genericParse);

  parse(xml: XMLElement): SourceDesc {
    return {
      type: SourceDesc,
      class: getClass(xml),
      content: parseChildren(xml, this.genericParse, true),
      attributes: this.attributeParser.parse(xml),
      structuredData: Array.from(xml.children).filter(el => el.tagName === 'p').length !== xml.children.length,
      msDesc: queryAndParseElement<MsDesc>(xml, 'note', this.msDescParser),
      bibl: queryAndParseElements<GenericElement>(xml, 'bibl', this.genericElemParser),
      biblFull: queryAndParseElements<GenericElement>(xml, 'biblFull', this.genericElemParser),
      biblStruct: queryAndParseElements<GenericElement>(xml, 'biblStruct', this.genericElemParser),
      recordingStmt: queryAndParseElements<GenericElement>(xml, 'recordingStmt', this.genericElemParser),
      scriptStmt: queryAndParseElements<GenericElement>(xml, 'scriptStmt', this.genericElemParser),
    };
  }
}

export class ExtentParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Extent {
    return {
      ...super.parse(xml),
      type: Extent,
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
  private titleStmtParser = createParser(TitleStmtParser, this.genericParse);
  private editionStmtParser = createParser(EditionStmtParser, this.genericParse);
  private publicationStmtParser = createParser(PublicationStmtParser, this.genericParse);
  private seriesStmtParser = createParser(SeriesStmtParser, this.genericParse);
  private notesStmtParser = createParser(NotesStmtParser, this.genericParse);
  private sourceDescParser = createParser(SourceDescParser, this.genericParse);
  private extentParser = createParser(ExtentParser, this.genericParse);

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
      sourceDesc: queryAndParseElement<SourceDesc>(xml, 'sourceDesc', this.sourceDescParser),
      extent: queryAndParseElement<Extent>(xml, 'extent', this.extentParser),
      notesStmt: queryAndParseElement<NotesStmt>(xml, 'notesStmt', this.notesStmtParser),
      seriesStmt: queryAndParseElement<SeriesStmt>(xml, 'seriesStmt', this.seriesStmtParser),
    };
  }
}
