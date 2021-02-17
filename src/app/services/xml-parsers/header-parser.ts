import { isNestedInElem } from 'src/app/utils/dom-utils';
import { xmlParser } from '.';
import {
  Abstract, Calendar, CalendarDesc, CatRef, Channel, ChannelMode, ClassCode, Constitution,
  Correction, CorrectionMethod, CorrectionStatus, CorrespAction, CorrespActionType, CorrespContext, CorrespDesc, Creation, CRefPattern,
  Degree, Derivation, Description, Domain, EditionStmt, EditorialDecl, EncodingDesc, Extent, Factuality, FileDesc, GenericElement,
  HandNote, HandNotes, HandNoteScope, Hyphenation, HyphenationEol, Interaction,
  Interpretation, Keywords, Language, LangUsage, ListTranspose, MsDesc, NamedEntitiesList, NamedEntityRef, Namespace, Normalization,
  NormalizationMethod, Note, NotesStmt, Paragraph, ParticDesc, Preparedness, ProfileDesc, ProjectDesc, Ptr, PublicationStmt,
  Punctuation, PunctuationMarks, PunctuationPlacement,
  Purpose, Quotation, QuotationMarks, RefsDecl, RefState, Rendition, RenditionScope, Resp, RespStmt, SamplingDecl, Scheme, Segmentation,
  SeriesStmt, Setting, SettingDesc, SourceDesc, StdVals, TagsDecl, TagUsage, Term, TextClass, TextDesc, TitleStmt, Transpose, XMLElement,
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

@xmlParser('creation', CreationParser)
export class CreationParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Creation {
    return {
      ...super.parse(xml),
      type: Creation,
    };
  }
}

@xmlParser('language', LanguageParser)
export class LanguageParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Language {
    return {
      ...super.parse(xml),
      type: Language,
      ident: xml.getAttribute('ident'),
      usage: parseInt(xml.getAttribute('usage'), 10) || undefined,
    };
  }
}

@xmlParser('langUsage', LangUsageParser)
export class LangUsageParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): LangUsage {
    return {
      ...super.parse(xml),
      type: LangUsage,
      structuredData: Array.from(xml.querySelectorAll<XMLElement>(':scope > p')).length > 0,
      languages: queryAndParseElements<Language>(xml, 'language'),
    };
  }
}

@xmlParser('classCode', ClassCodeParser)
export class ClassCodeParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): ClassCode {
    return {
      ...super.parse(xml),
      type: ClassCode,
      scheme: xml.getAttribute('scheme'),
    };
  }
}

@xmlParser('catRef', CatRefParser)
export class CatRefParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): CatRef {
    return {
      ...super.parse(xml),
      type: CatRef,
      scheme: xml.getAttribute('scheme'),
      target: xml.getAttribute('target'),
    };
  }
}

@xmlParser('keywords', KeywordsParser)
export class KeywordsParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Keywords {
    return {
      ...super.parse(xml),
      type: Keywords,
      scheme: xml.getAttribute('scheme'),
      terms: queryAndParseElements<Term>(xml, 'term'),
    };
  }
}

@xmlParser('textClass', TextClassParser)
export class TextClassParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): TextClass {
    return {
      ...super.parse(xml),
      type: TextClass,
      keywords: queryAndParseElements<Keywords>(xml, 'keywords'),
      catRef: queryAndParseElements<CatRef>(xml, 'catRef'),
      classCode: queryAndParseElements<ClassCode>(xml, 'classCode'),
    };
  }
}

@xmlParser('handNote', HandNoteParser)
export class HandNoteParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): HandNote {
    return {
      ...super.parse(xml),
      type: HandNote,
      id: getID(xml),
      scribe: xml.getAttribute('scribe'),
      scribeRef: xml.getAttribute('scribeRef'),
      script: xml.getAttribute('script'),
      scriptRef: xml.getAttribute('scriptRef'),
      medium: xml.getAttribute('medium'),
      scope: xml.getAttribute('scope') as HandNoteScope,
    };
  }
}

@xmlParser('handNotes', HandNotesParser)
export class HandNotesParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): HandNotes {
    return {
      ...super.parse(xml),
      type: HandNotes,
      content: queryAndParseElements<HandNote>(xml, 'keywords'),
    };
  }
}

@xmlParser('transpose', TransposeParser)
export class TransposeParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Transpose {
    return {
      ...super.parse(xml),
      type: Transpose,
      content: queryAndParseElements<Ptr>(xml, 'ptr'),
    };
  }
}

@xmlParser('listTranspose', ListTransposeParser)
export class ListTransposeParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): ListTranspose {
    return {
      ...super.parse(xml),
      type: ListTranspose,
      description: queryAndParseElements<Description>(xml, 'desc'),
      transposes: queryAndParseElements<Transpose>(xml, 'transpose'),
    };
  }
}

@xmlParser('channel', ChannelParser)
export class ChannelParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Channel {
    return {
      ...super.parse(xml),
      type: Channel,
      mode: xml.getAttribute('mode') as ChannelMode,
    };
  }
}

@xmlParser('constitution', ConstitutionParser)
export class ConstitutionParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Constitution {
    return {
      ...super.parse(xml),
      type: Constitution,
      constitutionType: xml.getAttribute('type'),
    };
  }
}

@xmlParser('derivation', DerivationParser)
export class DerivationParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Derivation {
    return {
      ...super.parse(xml),
      type: Derivation,
      derivationType: xml.getAttribute('type'),
    };
  }
}

@xmlParser('domain', DomainParser)
export class DomainParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Domain {
    return {
      ...super.parse(xml),
      type: Domain,
      domainType: xml.getAttribute('type'),
    };
  }
}

@xmlParser('factuality', FactualityParser)
export class FactualityParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Factuality {
    return {
      ...super.parse(xml),
      type: Factuality,
      factualityType: xml.getAttribute('type'),
    };
  }
}

@xmlParser('interaction', InteractionParser)
export class InteractionParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Interaction {
    return {
      ...super.parse(xml),
      type: Interaction,
      interactionType: xml.getAttribute('type'),
      active: xml.getAttribute('type'),
      passive: xml.getAttribute('type'),
    };
  }
}

@xmlParser('preparedness', PreparednessParser)
export class PreparednessParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Preparedness {
    return {
      ...super.parse(xml),
      type: Preparedness,
      preparednessType: xml.getAttribute('type'),
    };
  }
}

@xmlParser('purpose', PurposeParser)
export class PurposeParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Purpose {
    return {
      ...super.parse(xml),
      type: Purpose,
      purposeType: xml.getAttribute('type'),
      degree: xml.getAttribute('degree') as Degree,
    };
  }
}

@xmlParser('textDesc', TextDescParser)
export class TextDescParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): TextDesc {
    return {
      ...super.parse(xml),
      type: TextDesc,
      channel: queryAndParseElements<Channel>(xml, 'channel'),
      constitution: queryAndParseElements<Constitution>(xml, 'constitution'),
      derivation: queryAndParseElements<Derivation>(xml, 'derivation'),
      domain: queryAndParseElements<Domain>(xml, 'domain'),
      factuality: queryAndParseElements<Factuality>(xml, 'factuality'),
      interaction: queryAndParseElements<Interaction>(xml, 'interaction'),
      preparedness: queryAndParseElements<Preparedness>(xml, 'preparedness'),
      purpose: queryAndParseElements<Purpose>(xml, 'purpose'),
    };
  }
}

@xmlParser('particDesc', ParticDescParser)
export class ParticDescParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): ParticDesc {
    return {
      ...super.parse(xml),
      type: ParticDesc,
      structuredData: Array.from(xml.children).filter(el => el.tagName === 'p').length !== xml.children.length,
      participants: queryAndParseElements<NamedEntitiesList>(xml, 'listPerson').concat(queryAndParseElements<NamedEntitiesList>(xml, 'listOrg')),
    };
  }
}

@xmlParser('setting', SettingParser)
export class SettingParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): Setting {
    const names = queryAndParseElements<GenericElement>(xml, 'name');
    const orgNames = queryAndParseElements<GenericElement>(xml, 'orgName');
    const persNames = queryAndParseElements<GenericElement>(xml, 'persName');
    const placeNames = queryAndParseElements<GenericElement>(xml, 'placeName');

    return {
      ...super.parse(xml),
      type: Setting,
      who: xml.getAttribute('who'),
      name: names.concat(orgNames).concat(persNames).concat(placeNames),
      date: queryAndParseElements(xml, 'date'),
      time: queryAndParseElements(xml, 'time'),
      locale: queryAndParseElements(xml, 'locale'),
      activity: queryAndParseElements(xml, 'activity'),
    };
  }
}

@xmlParser('settingDesc', SettingDescParser)
export class SettingDescParser extends GenericElemParser implements Parser<XMLElement> {
  parse(xml: XMLElement): SettingDesc {
    return {
      ...super.parse(xml),
      type: SettingDesc,
      structuredData: Array.from(xml.children).filter(el => el.tagName === 'p').length !== xml.children.length,
      settings: queryAndParseElements<Setting>(xml, 'setting'),
      places: queryAndParseElements<NamedEntitiesList>(xml, 'listPlace'),
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
      creation: queryAndParseElements<Creation>(xml, 'creation'),
      handNotes: queryAndParseElements<HandNotes>(xml, 'handNotes'),
      langUsage: queryAndParseElements<LangUsage>(xml, 'langUsage'),
      listTranspose: queryAndParseElements<ListTranspose>(xml, 'listTranspose'),
      particDesc: queryAndParseElements<ParticDesc>(xml, 'particDesc'),
      settingDesc: queryAndParseElements<SettingDesc>(xml, 'settingDesc'),
      textClass: queryAndParseElements<TextClass>(xml, 'textClass'),
      textDesc: queryAndParseElements<TextDesc>(xml, 'textDesc'),
    };
  }
}
