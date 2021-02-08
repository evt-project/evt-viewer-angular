import { isNestedInElem } from 'src/app/utils/dom-utils';
import { xmlParser } from '.';
import {
  Abstract, Calendar, CalendarDesc,
  Correction, CorrectionMethod, CorrectionStatus, CorrespAction, CorrespActionType, CorrespContext, CorrespDesc, CRefPattern,
  EditionStmt, EditorialDecl, EncodingDesc, Extent, FileDesc, GenericElement, Hyphenation, HyphenationEol,
  Interpretation, MsDesc, NamedEntityRef, Namespace, Normalization, NormalizationMethod, Note,
  NotesStmt, Paragraph, ProfileDesc, ProjectDesc, PublicationStmt, Punctuation, PunctuationMarks, PunctuationPlacement,
  Quotation, QuotationMarks, RefsDecl, RefState, Rendition, RenditionScope, Resp, RespStmt, SamplingDecl, Scheme, Segmentation,
  SeriesStmt, SourceDesc, StdVals, TagsDecl, TagUsage, TitleStmt, XMLElement,
} from '../../models/evt-models';
import { GenericElemParser, GenericParser, queryAndParseElement, queryAndParseElements } from './basic-parsers';
import { NamedEntityRefParser } from './named-entity-parsers';
import { createParser, getID, Parser } from './parser-models';

@xmlParser('resp', RespParser)
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

@xmlParser('respStmt', RespStmtParser)
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
      responsibility: queryAndParseElement<Resp>(xml, 'resp'),
      notes: queryAndParseElements<Note>(xml, 'note'),
      people,
    };
  }
}

@xmlParser('titleStmt', TitleStmtParser)
export class TitleStmtParser extends GenericParser implements Parser<XMLElement> {
  parse(xml: XMLElement): TitleStmt {
    const title = queryAndParseElements<GenericElement>(xml, 'title[type="main"]');

    return {
      ...super.parse(xml),
      type: TitleStmt,
      titles: title.length > 0 ? title : queryAndParseElements<GenericElement>(xml, 'title:not([type="sub"])'),
      subtitles: queryAndParseElements<GenericElement>(xml, 'title[type="sub"]'),
      authors: queryAndParseElements<GenericElement>(xml, 'author'),
      editors: queryAndParseElements<GenericElement>(xml, 'editor'),
      sponsors: queryAndParseElements<GenericElement>(xml, 'sponsor'),
      funders: queryAndParseElements<GenericElement>(xml, 'funder'),
      principals: queryAndParseElements<GenericElement>(xml, 'principal'),
      respStmts: queryAndParseElements<RespStmt>(xml, 'respStmt'),
    };
  }
}

@xmlParser('editionStmt', EditionStmtParser)
export class EditionStmtParser extends GenericParser implements Parser<XMLElement> {
  parse(xml: XMLElement): EditionStmt {
    return {
      ...super.parse(xml),
      type: EditionStmt,
      edition: queryAndParseElements<GenericElement>(xml, 'edition'),
      respStmt: queryAndParseElements<RespStmt>(xml, 'respStmt'),
      structuredData: Array.from(xml.children).filter(el => el.tagName === 'p').length !== xml.children.length,
    };
  }
}

@xmlParser('publicationStmt', PublicationStmtParser)
export class PublicationStmtParser extends GenericParser implements Parser<XMLElement> {
  parse(xml: XMLElement): PublicationStmt {
    return {
      ...super.parse(xml),
      type: PublicationStmt,
      structuredData: Array.from(xml.children).filter(el => el.tagName === 'p').length !== xml.children.length,
      publisher: queryAndParseElements<GenericElement>(xml, 'publisher'),
      distributor: queryAndParseElements<GenericElement>(xml, 'distributor'),
      authority: queryAndParseElements<GenericElement>(xml, 'authority'),
      pubPlace: queryAndParseElements<GenericElement>(xml, 'pubPlace'),
      address: queryAndParseElements<GenericElement>(xml, 'address'),
      idno: queryAndParseElements<GenericElement>(xml, 'idno'),
      availability: queryAndParseElements<GenericElement>(xml, 'availability'),
      date: queryAndParseElements<GenericElement>(xml, 'date'),
      licence: queryAndParseElements<GenericElement>(xml, 'licence'),
    };
  }
}

@xmlParser('seriesStmt', SeriesStmtParser)
export class SeriesStmtParser extends GenericParser implements Parser<XMLElement> {
  parse(xml: XMLElement): SeriesStmt {
    return {
      ...super.parse(xml),
      type: SeriesStmt,
      structuredData: Array.from(xml.querySelectorAll(':scope > p')).length === 0,
      title: queryAndParseElements<GenericElement>(xml, 'title'),
      idno: queryAndParseElements<GenericElement>(xml, 'idno'),
      respStmt: queryAndParseElements<RespStmt>(xml, 'respStmt'),
      editor: queryAndParseElements<GenericElement>(xml, 'editor'),
      biblScope: queryAndParseElements<GenericElement>(xml, 'biblScope'),
    };
  }
}

@xmlParser('notesStmt', NotesStmtParser)
export class NotesStmtParser extends GenericParser implements Parser<XMLElement> {
  parse(xml: XMLElement): NotesStmt {
    return {
      ...super.parse(xml),
      type: NotesStmt,
      notes: queryAndParseElements<Note>(xml, 'note'),
      relatedItems: queryAndParseElements<GenericElement>(xml, 'relatedItem'),
    };
  }
}

@xmlParser('sourceDesc', SourceDescParser)
export class SourceDescParser extends GenericParser implements Parser<XMLElement> {
  parse(xml: XMLElement): SourceDesc {
    return {
      ...super.parse(xml),
      type: SourceDesc,
      structuredData: Array.from(xml.children).filter(el => el.tagName === 'p').length !== xml.children.length,
      msDesc: queryAndParseElement<MsDesc>(xml, 'msDesc'),
      bibl: queryAndParseElements<GenericElement>(xml, 'bibl'),
      biblFull: queryAndParseElements<GenericElement>(xml, 'biblFull'),
      biblStruct: queryAndParseElements<GenericElement>(xml, 'biblStruct'),
      recordingStmt: queryAndParseElements<GenericElement>(xml, 'recordingStmt'),
      scriptStmt: queryAndParseElements<GenericElement>(xml, 'scriptStmt'),
    };
  }
}

@xmlParser('extent', ExtentParser)
export class ExtentParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Extent {
    return {
      ...super.parse(xml),
      type: Extent,
    };
  }
}

@xmlParser('fileDesc', FileDescParser)
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
      titleStmt: queryAndParseElement<TitleStmt>(xml, 'titleStmt'),
      editionStmt: queryAndParseElement<EditionStmt>(xml, 'editionStmt'),
      publicationStmt: queryAndParseElement<PublicationStmt>(xml, 'publicationStmt'),
      sourceDesc: queryAndParseElement<SourceDesc>(xml, 'sourceDesc'),
      extent: queryAndParseElement<Extent>(xml, 'extent'),
      notesStmt: queryAndParseElement<NotesStmt>(xml, 'notesStmt'),
      seriesStmt: queryAndParseElement<SeriesStmt>(xml, 'seriesStmt'),
    };
  }
}

@xmlParser('projectDesc', ProjectDescParser)
export class ProjectDescParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): ProjectDesc {
    return {
      ...super.parse(xml),
      type: ProjectDesc,
      content: queryAndParseElements<Paragraph>(xml, 'p'),
    };
  }
}

@xmlParser('samplingDecl', SamplingDeclParser)
export class SamplingDeclParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): SamplingDecl {
    return {
      ...super.parse(xml),
      type: SamplingDecl,
      content: queryAndParseElements<Paragraph>(xml, 'p'),
    };
  }
}

@xmlParser('correction', CorrectionParser)
export class CorrectionParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Correction {
    return {
      ...super.parse(xml),
      type: Correction,
      content: queryAndParseElements<Paragraph>(xml, 'p'),
      status: xml.getAttribute('status') as CorrectionStatus,
      method: xml.getAttribute('method') as CorrectionMethod || 'silent',
    };
  }
}

@xmlParser('normalization', NormalizationParser)
export class NormalizationParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Normalization {
    return {
      ...super.parse(xml),
      type: Normalization,
      content: queryAndParseElements<Paragraph>(xml, 'p'),
      sources: xml.getAttribute('source')?.split(' ') || [],
      method: xml.getAttribute('method') as NormalizationMethod || 'silent',
    };
  }
}

@xmlParser('punctuation', PunctuationParser)
export class PunctuationParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Punctuation {
    return {
      ...super.parse(xml),
      type: Punctuation,
      content: queryAndParseElements<Paragraph>(xml, 'p'),
      marks: xml.getAttribute('marks') as PunctuationMarks,
      placement: xml.getAttribute('placement') as PunctuationPlacement,
    };
  }
}

@xmlParser('quotation', QuotationParser)
export class QuotationParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Quotation {
    return {
      ...super.parse(xml),
      type: Quotation,
      content: queryAndParseElements<Paragraph>(xml, 'p'),
      marks: xml.getAttribute('marks') as QuotationMarks,
    };
  }
}

@xmlParser('hyphenation', HyphenationParser)
export class HyphenationParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Hyphenation {
    return {
      ...super.parse(xml),
      type: Hyphenation,
      content: queryAndParseElements<Paragraph>(xml, 'p'),
      eol: xml.getAttribute('eol') as HyphenationEol,
    };
  }
}

@xmlParser('segmentation', SegmentationParser)
export class SegmentationParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Segmentation {
    return {
      ...super.parse(xml),
      type: Segmentation,
      content: queryAndParseElements<Paragraph>(xml, 'p'),
    };
  }
}

@xmlParser('stdVals', StdValsParser)
export class StdValsParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): StdVals {
    return {
      ...super.parse(xml),
      type: StdVals,
      content: queryAndParseElements<Paragraph>(xml, 'p'),
    };
  }
}

@xmlParser('interpretation', InterpretationParser)
export class InterpretationParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Interpretation {
    return {
      ...super.parse(xml),
      type: Interpretation,
      content: queryAndParseElements<Paragraph>(xml, 'p'),
    };
  }
}

@xmlParser('editorialDecl', EditorialDeclParser)
export class EditorialDeclParser extends GenericParser implements Parser<XMLElement> {
  parse(xml: XMLElement): EditorialDecl {
    return {
      ...super.parse(xml),
      type: EditorialDecl,
      structuredData: Array.from(xml.children).filter(el => el.tagName === 'p').length !== xml.children.length,
      correction: queryAndParseElements<Correction>(xml, 'correction'),
      hyphenation: queryAndParseElements<Hyphenation>(xml, 'hyphenation'),
      interpretation: queryAndParseElements<Interpretation>(xml, 'interpretation'),
      normalization: queryAndParseElements<Normalization>(xml, 'normalization'),
      punctuation: queryAndParseElements<Punctuation>(xml, 'punctuation'),
      quotation: queryAndParseElements<Quotation>(xml, 'quotation'),
      segmentation: queryAndParseElements<Segmentation>(xml, 'segmentation'),
      stdVals: queryAndParseElements<StdVals>(xml, 'stdVals'),
    };
  }
}

@xmlParser('rendition', RenditionParser)
export class RenditionParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Rendition {
    return {
      ...super.parse(xml),
      type: Rendition,
      id: getID(xml),
      scope: xml.getAttribute('scope') as RenditionScope || '',
      selector: xml.getAttribute('selector') || '',
      scheme: xml.getAttribute('scheme') as Scheme || undefined,
      schemeVersion: xml.getAttribute('schemeVersion') || '',
    };
  }
}

@xmlParser('tagUsage', TagUsageParser)
export class TagUsageParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): TagUsage {
    return {
      ...super.parse(xml),
      type: TagUsage,
      gi: xml.getAttribute('gi'),
      occurs: parseInt(xml.getAttribute('occurs'), 10) || undefined,
      withId: parseInt(xml.getAttribute('withId'), 10) || undefined,
    };
  }
}

@xmlParser('namespace', NamespaceParser)
export class NamespaceParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Namespace {
    return {
      ...super.parse(xml),
      type: Namespace,
      name: xml.getAttribute('name') || '',
      tagUsage: queryAndParseElements<TagUsage>(xml, 'tagUsage'),
    };
  }
}

@xmlParser('tagsDecl', TagsDeclParser)
export class TagsDeclParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): TagsDecl {
    return {
      ...super.parse(xml),
      type: TagsDecl,
      rendition: queryAndParseElements<Rendition>(xml, 'rendition'),
      namespace: queryAndParseElements<Namespace>(xml, 'namespace'),
    };
  }
}

@xmlParser('cRefPattern', CRefPatternParser)
export class CRefPatternParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): CRefPattern {
    return {
      ...super.parse(xml),
      type: CRefPattern,
      matchPattern: xml.getAttribute('matchPattern'),
      replacementPattern: xml.getAttribute('replacementPattern'),
    };
  }
}

@xmlParser('refState', RefStateParser)
export class RefStateParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): RefState {
    return {
      ...super.parse(xml),
      type: RefState,
      ed: xml.getAttribute('ed'),
      unit: xml.getAttribute('unit'),
      length: parseInt(xml.getAttribute('length'), 10) || 0,
      delim: xml.getAttribute('delim'),
    };
  }
}

@xmlParser('refsDecl', RefsDeclParser)
export class RefsDeclParser extends GenericElemParser implements Parser<XMLElement> {
  cRefPatternParser = createParser(CRefPatternParser, this.genericParse);
  refStateParser = createParser(RefStateParser, this.genericParse);

  parse(xml: XMLElement): RefsDecl {
    return {
      ...super.parse(xml),
      type: RefsDecl,
      structuredData: Array.from(xml.children).filter(el => el.tagName === 'p').length !== xml.children.length,
      cRefPattern: queryAndParseElements<CRefPattern>(xml, 'cRefPattern'),
      refState: queryAndParseElements<RefState>(xml, 'refState'),
    };
  }
}

@xmlParser('encodingDesc', EncodingDescParser)
export class EncodingDescParser extends GenericParser implements Parser<XMLElement> {
  parse(xml: XMLElement): EncodingDesc {
    return {
      ...super.parse(xml),
      type: EncodingDesc,
      structuredData: Array.from(xml.children).filter(el => el.tagName === 'p').length !== xml.children.length,
      projectDesc: queryAndParseElements<ProjectDesc>(xml, 'projectDesc'),
      samplingDecl: queryAndParseElements<SamplingDecl>(xml, 'samplingDecl'),
      editorialDecl: queryAndParseElements<EditorialDecl>(xml, 'editorialDecl'),
      tagsDecl: queryAndParseElements<TagsDecl>(xml, 'tagsDecl'),
      styleDefDecl: queryAndParseElements<GenericElement>(xml, 'styleDefDecl'),
      refsDecl: queryAndParseElements<RefsDecl>(xml, 'refsDecl'),
      classDecl: queryAndParseElements<GenericElement>(xml, 'classDecl'),
      geoDecl: queryAndParseElements<GenericElement>(xml, 'geoDecl'),
      unitDecl: queryAndParseElements<GenericElement>(xml, 'unitDecl'),
      schemaSpec: queryAndParseElements<GenericElement>(xml, 'schemaSpec'),
      schemaRef: queryAndParseElements<GenericElement>(xml, 'schemaRef'),
    };
  }
}

@xmlParser('abstract', AbstractParser)
export class AbstractParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Abstract {
    return {
      ...super.parse(xml),
      type: Abstract,
      resp: xml.getAttribute('resp'),
      lang: xml.getAttribute('xml:lang'),
    };
  }
}

@xmlParser('calendar', CalendarParser)
export class CalendarParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Calendar {
    return {
      ...super.parse(xml),
      type: Calendar,
      id: xml.getAttribute('xml:id'),
      target: xml.getAttribute('target'),
    };
  }
}

@xmlParser('calendarDesc', CalendarDescParser)
export class CalendarDescParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): CalendarDesc {
    return {
      ...super.parse(xml),
      type: CalendarDesc,
      calendars: queryAndParseElements<Calendar>(xml, 'calendar'),
    };
  }
}

@xmlParser('correspAction', CorrespActionParser)
export class CorrespActionParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): CorrespAction {
    return {
      ...super.parse(xml),
      type: CorrespAction,
      actionType: xml.getAttribute('type') as CorrespActionType,
    };
  }
}

@xmlParser('correspContext', CorrespContextParser)
export class CorrespContextParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): CorrespContext {
    return {
      ...super.parse(xml),
      type: CorrespContext,
    };
  }
}

@xmlParser('correspDesc', CorrespDescParser)
export class CorrespDescParser extends GenericParser implements Parser<XMLElement> {
  parse(xml: XMLElement): CorrespDesc {
    return {
      ...super.parse(xml),
      type: CorrespDesc,
      content: queryAndParseElements<CorrespAction | CorrespContext | Note | Paragraph>(xml, 'correspAction, correspContext, note, p'),
    };
  }
}

@xmlParser('profileDesc', ProfileDescParser)
export class ProfileDescParser extends GenericParser implements Parser<XMLElement> {
  parse(xml: XMLElement): ProfileDesc {
    return {
      ...super.parse(xml),
      type: ProfileDesc,
      abstract: queryAndParseElements<Abstract>(xml, 'abstract'),
      calendarDesc: queryAndParseElements<CalendarDesc>(xml, 'calendarDesc'),
      correspDesc: queryAndParseElements<CorrespDesc>(xml, 'correspDesc'),
      creation: queryAndParseElements<GenericElement>(xml, 'creation'),
      handNotes: queryAndParseElements<GenericElement>(xml, 'handNotes'),
      langUsage: queryAndParseElements<GenericElement>(xml, 'langUsage'),
      listTranspose: queryAndParseElements<GenericElement>(xml, 'listTranspose'),
      particDesc: queryAndParseElements<GenericElement>(xml, 'particDesc'),
      settingDesc: queryAndParseElements<GenericElement>(xml, 'settingDesc'),
      textClass: queryAndParseElements<GenericElement>(xml, 'textClass'),
      textDesc: queryAndParseElements<GenericElement>(xml, 'textDesc'),
    };
  }
}
