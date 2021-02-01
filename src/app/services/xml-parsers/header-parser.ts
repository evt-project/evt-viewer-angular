import { isNestedInElem } from 'src/app/utils/dom-utils';
import {
  Correction, CorrectionMethod, CorrectionStatus, EditionStmt, EditorialDecl, EncodingDesc, Extent, FileDesc,
  GenericElement, Hyphenation, HyphenationEol, MsDesc, NamedEntityRef, Normalization, NormalizationMethod, Note,
  NotesStmt, Paragraph, ProjectDesc, PublicationStmt, Punctuation, PunctuationMarks, PunctuationPlacement,
  Quotation, QuotationMarks, Resp, RespStmt, SamplingDecl, SeriesStmt, SourceDesc, TitleStmt, XMLElement,
} from '../../models/evt-models';
import {
  GenericElemParser, GenericParser, NoteParser, ParagraphParser,
  queryAndParseElement, queryAndParseElements,
} from './basic-parsers';
import { MsDescParser } from './msdesc-parser';
import { NamedEntityRefParser } from './named-entity-parsers';
import { createParser, Parser } from './parser-models';

class PContentParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): ProjectDesc {
    return {
      ...super.parse(xml),
      content: queryAndParseElements<Paragraph>(xml, 'p', createParser(ParagraphParser, this.genericParse)),
    };
  }
}

export class RespParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Resp {
    const { ref, when } = this.attributeParser.parse(xml);
    const normalizedResp = ref?.indexOf('http://') < 0 && ref?.indexOf('https://') < 0 ? `http://${ref}` : ref ?? '';

    return {
      ...super.parse(xml),
      type: Resp,
      normalizedResp,
      date: when || '',
    };
  }
}

export class RespStmtParser extends GenericElemParser implements Parser<XMLElement> {
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
      ...super.parse(xml),
      type: RespStmt,
      responsibility: queryAndParseElement<Resp>(xml, 'resp', createParser(RespParser, this.genericParse)),
      notes: queryAndParseElements<Note>(xml, 'note', createParser(NoteParser, this.genericParse)),
      people,
    };
  }
}

export class TitleStmtParser extends GenericParser implements Parser<XMLElement> {
  parse(xml: XMLElement): TitleStmt {
    const title = queryAndParseElements<GenericElement>(xml, 'title[type="main"]', this.genericElemParser);

    return {
      ...super.parse(xml),
      type: TitleStmt,
      titles: title.length > 0 ? title : queryAndParseElements<GenericElement>(xml, 'title:not([type="sub"])', this.genericElemParser),
      subtitles: queryAndParseElements<GenericElement>(xml, 'title[type="sub"]', this.genericElemParser),
      authors: queryAndParseElements<GenericElement>(xml, 'author', this.genericElemParser),
      editors: queryAndParseElements<GenericElement>(xml, 'editor', this.genericElemParser),
      sponsors: queryAndParseElements<GenericElement>(xml, 'sponsor', this.genericElemParser),
      funders: queryAndParseElements<GenericElement>(xml, 'funder', this.genericElemParser),
      principals: queryAndParseElements<GenericElement>(xml, 'principal', this.genericElemParser),
      respStmts: queryAndParseElements<RespStmt>(xml, 'respStmt', createParser(RespStmtParser, this.genericParse)),
    };
  }
}

export class EditionStmtParser extends GenericParser implements Parser<XMLElement> {
  parse(xml: XMLElement): EditionStmt {
    return {
      ...super.parse(xml),
      type: EditionStmt,
      edition: queryAndParseElements<GenericElement>(xml, 'edition', this.genericElemParser),
      respStmt: queryAndParseElements<RespStmt>(xml, 'respStmt', createParser(RespStmtParser, this.genericParse)),
      structuredData: Array.from(xml.children).filter(el => el.tagName === 'p').length !== xml.children.length,
    };
  }
}

export class PublicationStmtParser extends GenericParser implements Parser<XMLElement> {
  parse(xml: XMLElement): PublicationStmt {
    return {
      ...super.parse(xml),
      type: PublicationStmt,
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

export class SeriesStmtParser extends GenericParser implements Parser<XMLElement> {
  parse(xml: XMLElement): SeriesStmt {
    return {
      ...super.parse(xml),
      type: SeriesStmt,
      structuredData: Array.from(xml.querySelectorAll(':scope > p')).length === 0,
      title: queryAndParseElements<GenericElement>(xml, 'title', this.genericElemParser),
      idno: queryAndParseElements<GenericElement>(xml, 'idno', this.genericElemParser),
      respStmt: queryAndParseElements<RespStmt>(xml, 'respStmt', createParser(RespStmtParser, this.genericParse)),
      editor: queryAndParseElements<GenericElement>(xml, 'editor', this.genericElemParser),
      biblScope: queryAndParseElements<GenericElement>(xml, 'biblScope', this.genericElemParser),
    };
  }
}

export class NotesStmtParser extends GenericParser implements Parser<XMLElement> {
  parse(xml: XMLElement): NotesStmt {
    return {
      ...super.parse(xml),
      type: NotesStmt,
      notes: queryAndParseElements<Note>(xml, 'note', createParser(NoteParser, this.genericParse)),
      relatedItems: queryAndParseElements<GenericElement>(xml, 'relatedItem', this.genericElemParser),
    };
  }
}

export class SourceDescParser extends GenericParser implements Parser<XMLElement> {
  parse(xml: XMLElement): SourceDesc {
    return {
      ...super.parse(xml),
      type: SourceDesc,
      structuredData: Array.from(xml.children).filter(el => el.tagName === 'p').length !== xml.children.length,
      msDesc: queryAndParseElement<MsDesc>(xml, 'note', createParser(MsDescParser, this.genericParse)),
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

  parse(xml: XMLElement): FileDesc {
    xml = xml.cloneNode(true) as XMLElement;
    Array.from(xml.querySelectorAll<XMLElement>(this.excludeFromParsing.toString()))
      .filter((list) => !isNestedInElem(list, list.tagName))
      .forEach(el => el.remove());

    return {
      ...super.parse(xml),
      type: FileDesc,
      titleStmt: queryAndParseElement<TitleStmt>(xml, 'titleStmt', createParser(TitleStmtParser, this.genericParse)),
      editionStmt: queryAndParseElement<EditionStmt>(xml, 'editionStmt', createParser(EditionStmtParser, this.genericParse)),
      publicationStmt: queryAndParseElement<PublicationStmt>(
        xml, 'publicationStmt', createParser(PublicationStmtParser, this.genericParse)),
      sourceDesc: queryAndParseElement<SourceDesc>(xml, 'sourceDesc', createParser(SourceDescParser, this.genericParse)),
      extent: queryAndParseElement<Extent>(xml, 'extent', createParser(ExtentParser, this.genericParse)),
      notesStmt: queryAndParseElement<NotesStmt>(xml, 'notesStmt', createParser(NotesStmtParser, this.genericParse)),
      seriesStmt: queryAndParseElement<SeriesStmt>(xml, 'seriesStmt', createParser(SeriesStmtParser, this.genericParse)),
    };
  }
}

export class ProjectDescParser extends PContentParser implements Parser<XMLElement> {
  parse(xml: XMLElement): ProjectDesc {
    return {
      ...super.parse(xml),
      type: ProjectDesc,
    };
  }
}

export class SamplingDeclParser extends PContentParser implements Parser<XMLElement> {
  parse(xml: XMLElement): SamplingDecl {
    return {
      ...super.parse(xml),
      type: SamplingDecl,
    };
  }
}

export class CorrectionParser extends PContentParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Correction {
    return {
      ...super.parse(xml),
      type: Correction,
      status: xml.getAttribute('status') as CorrectionStatus,
      method: xml.getAttribute('method') as CorrectionMethod || 'silent',
    };
  }
}

export class NormalizationParser extends PContentParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Normalization {
    return {
      ...super.parse(xml),
      type: Normalization,
      sources: xml.getAttribute('source')?.split(' ') || [],
      method: xml.getAttribute('method') as NormalizationMethod || 'silent',
    };
  }
}

export class PunctuationParser extends PContentParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Punctuation {
    return {
      ...super.parse(xml),
      type: Punctuation,
      marks: xml.getAttribute('marks') as PunctuationMarks,
      placement: xml.getAttribute('placement') as PunctuationPlacement,
    };
  }
}

export class QuotationParser extends PContentParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Quotation {
    return {
      ...super.parse(xml),
      type: Quotation,
      marks: xml.getAttribute('marks') as QuotationMarks,
    };
  }
}

export class HyphenationParser extends PContentParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Hyphenation {
    return {
      ...super.parse(xml),
      type: Hyphenation,
      eol: xml.getAttribute('eol') as HyphenationEol,
    };
  }
}

export class EditorialDeclParser extends GenericParser implements Parser<XMLElement> {
  parse(xml: XMLElement): EditorialDecl {
    return {
      ...super.parse(xml),
      type: EditorialDecl,
      structuredData: Array.from(xml.children).filter(el => el.tagName === 'p').length !== xml.children.length,
      correction: queryAndParseElements<Correction>(xml, 'correction', createParser(CorrectionParser, this.genericParse)),
      hyphenation: queryAndParseElements<Hyphenation>(xml, 'hyphenation', createParser(HyphenationParser, this.genericParse)),
      interpretation: queryAndParseElements<GenericElement>(xml, 'interpretation', this.genericElemParser),
      normalization: queryAndParseElements<Normalization>(xml, 'normalization', createParser(NormalizationParser, this.genericParse)),
      punctuation: queryAndParseElements<Punctuation>(xml, 'punctuation', createParser(PunctuationParser, this.genericParse)),
      quotation: queryAndParseElements<Quotation>(xml, 'quotation', createParser(QuotationParser, this.genericParse)),
      segmentation: queryAndParseElements<GenericElement>(xml, 'segmentation', this.genericElemParser),
      stdVals: queryAndParseElements<GenericElement>(xml, 'stdVals', this.genericElemParser),
    };
  }
}

export class EncodingDescParser extends GenericParser implements Parser<XMLElement> {
  parse(xml: XMLElement): EncodingDesc {
    return {
      ...super.parse(xml),
      type: EncodingDesc,
      structuredData: Array.from(xml.children).filter(el => el.tagName === 'p').length !== xml.children.length,
      projectDesc: queryAndParseElements<ProjectDesc>(xml, 'projectDesc', createParser(ProjectDescParser, this.genericParse)),
      samplingDecl: queryAndParseElements<SamplingDecl>(xml, 'samplingDecl', createParser(SamplingDeclParser, this.genericParse)),
      editorialDecl: queryAndParseElements<EditorialDecl>(xml, 'editorialDecl', createParser(EditorialDeclParser, this.genericParse)),
      tagsDecl: queryAndParseElements<GenericElement>(xml, 'tagsDecl', this.genericElemParser),
      styleDefDecl: queryAndParseElements<GenericElement>(xml, 'styleDefDecl', this.genericElemParser),
      refsDecl: queryAndParseElements<GenericElement>(xml, 'refsDecl', this.genericElemParser),
      classDecl: queryAndParseElements<GenericElement>(xml, 'classDecl', this.genericElemParser),
      geoDecl: queryAndParseElements<GenericElement>(xml, 'geoDecl', this.genericElemParser),
      unitDecl: queryAndParseElements<GenericElement>(xml, 'unitDecl', this.genericElemParser),
      schemaSpec: queryAndParseElements<GenericElement>(xml, 'schemaSpec', this.genericElemParser),
      schemaRef: queryAndParseElements<GenericElement>(xml, 'schemaRef', this.genericElemParser),
    };
  }
}
