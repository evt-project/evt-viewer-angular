import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { EditionDataService } from '../edition-data.service';

function getStringFromTags(tagLabel: string, cit: Element) {
  let res = '';
  Array.from(cit.getElementsByTagName(tagLabel)).forEach(element => res += element.textContent.replace(/\s+/g, ' ') + ' ');

  return res.trim();
}

export class BiblStructClassKeysAimed {
  constructor(
    public analyticAuthor = '',
    public analyticTitle = '',
    public monogrAuthor = '',
    public monogrTitle = '',
    public monogrEditor = '',
    public monogrImprintPubPlace = '',
    public monogrImprintPublisher = '',
    public monogrBiblScope = '',
    public seriesTitle = '',
    public seriesBiblScope = '',
    public note = '',
  ) {
  }
}

export class BiblClassKeysAimed {
  constructor(
    public abbr = '',
    public add = '',
    public address = '',
    public author = '',
    public biblScope = '',
    public cb = '',
    public choice = '',
    public citedRange = '',
    public corr = '',
    public del = '',
    public distinct = '',
    public editor = '',
    public email = '',
    public emph = '',
    public expan = '',
    public foreign = '',
    public gap = '',
    public gb = '',
    public gloss = '',
    public hi = '',
    public index = '',
    public lb = '',
    public measure = '',
    public measureGrp = '',
    public meeting = '',
    public mentioned = '',
    public milestone = '',
    public name = '',
    public note = '',
    public orig = '',
    public pb = '',
    public ptr = '',
    public pubPlace = '',
    public publisher = '',
    public ref = '',
    public reg = '',
    public relatedItem = '',
    public respStmt = '',
    public rs = '',
    public series = '',
    public sic = '',
    public soCalled = '',
    public term = '',
    public textLang = '',
    public title = '',
    public unclear = '',
    public unit = '',
  ) {
  }
}

@Injectable({
  providedIn: 'root',
})
export class BibliographyParserService {
  private foundCits = { havingFields: 0, total: 0 };
  private bibliographicCitations: BibliographicCitation[] = [];
  public biblTagChilds = Object.keys(new BiblClassKeysAimed()).concat(['bibl', 'date', 'num', 'time']);
  public biblStructTagChilds = Object.keys(new BiblStructClassKeysAimed()).concat(['monogrImprintDate']);

  constructor(
    private edition: EditionDataService,
  ) {
  }

  public getBibliographicCitations(): Observable<CitationsFeature> {
    return this.edition.parsedEditionSource$.pipe(
      map(responses => {
        Array.from(responses.getElementsByTagName('bibl')).forEach(citation => {
          const res = {};
          this.biblTagChilds.forEach(biblTagChild => res[biblTagChild] = getStringFromTags(biblTagChild, citation));
          if (['author', 'title', 'date'].every(k => (res[k].trim() === '' || res[k] === null || res[k] === undefined))) {
            this.getCurb(citation.textContent.replace(/\s+/g, ' ').trim() as BibliographicCitation, true);
            this.foundCits.total++;
          } else {
            this.getCurb(res as BibliographicCitation, true);
            this.foundCits.havingFields++;
            this.foundCits.total++;
          }
        });

        Array.from(responses.getElementsByTagName('biblStruct')).forEach(citation => {
          const biblStructCitation: BibliographicCitation = {
            analyticAuthor: '',
            analyticTitle: '',
            monogrAuthor: '',
            monogrTitle: '',
            monogrEditor: '',
            monogrImprintPubPlace: '',
            monogrImprintPublisher: '',
            monogrImprintDate: '',
            monogrBiblScope: '',
            seriesTitle: '',
            seriesBiblScope: '',
            note: '',
          };
          Array.from(citation.getElementsByTagName('analytic')).forEach(features => {
            biblStructCitation.analyticAuthor += ' ' + getStringFromTags('author', features);
            biblStructCitation.analyticTitle += ' ' + getStringFromTags('title', features);
          });
          Array.from(citation.getElementsByTagName('monogr')).forEach(features => {
            biblStructCitation.monogrAuthor += ' ' + getStringFromTags('author', features);
            biblStructCitation.monogrTitle += ' ' + getStringFromTags('title', features);
            biblStructCitation.monogrEditor += ' ' + getStringFromTags('editor', features);
            Array.from(features.getElementsByTagName('imprint')).forEach(subFeatures => {
              biblStructCitation.monogrImprintPubPlace += ' ' + getStringFromTags('pubPlace', subFeatures);
              biblStructCitation.monogrImprintPublisher += ' ' + getStringFromTags('publisher', subFeatures);
              biblStructCitation.monogrImprintDate += ' ' + getStringFromTags('date', subFeatures);
            });
            biblStructCitation.monogrBiblScope += ' ' + getStringFromTags('biblScope', features);
          });
          Array.from(citation.getElementsByTagName('series')).forEach(features => {
            biblStructCitation.seriesTitle += ' ' + getStringFromTags('title', features);
            biblStructCitation.seriesBiblScope += ' ' + getStringFromTags('biblScope', features);
          });
          biblStructCitation.note += ' ' + getStringFromTags('note', citation);
          this.getCurb(biblStructCitation, !Object.values(biblStructCitation).every(x => (x === '')));
          this.foundCits.havingFields++;
          this.foundCits.total++;
        });

        return {
          citations: this.bibliographicCitations,
          areComplete: ((this.foundCits.havingFields === this.foundCits.total) ? true : false),
        } as CitationsFeature;
      }),
      shareReplay(1),
    );
  }
  private getCurb(bibliographicCitation: BibliographicCitation, eventCond: boolean) {
    if (eventCond && !this.bibliographicCitations.includes(bibliographicCitation)) {
      this.bibliographicCitations.push(bibliographicCitation);
    }
  }
}

interface BiblStructTagCitation {
  analyticAuthor: string;
  analyticTitle: string;
  monogrAuthor: string;
  monogrTitle: string;
  monogrEditor: string;
  monogrImprintPubPlace: string;
  monogrImprintPublisher: string;
  monogrImprintDate: Date | string;
  monogrBiblScope: string;
  seriesTitle: string;
  seriesBiblScope: string;
  note: string;
}

export class BiblTagCitation implements BiblClassKeysAimed {
  abbr: string;
  add: string;
  address: string;
  author: string;
  bibl: BiblTagCitation | string;
  biblScope: string;
  cb: string;
  choice: string;
  citedRange: string;
  corr: string;
  date: Date | string;
  del: string;
  distinct: string;
  editor: string;
  email: string;
  emph: string;
  expan: string;
  foreign: string;
  gap: string;
  gb: string;
  gloss: string;
  hi: string;
  index: string;
  lb: string;
  measure: string;
  measureGrp: string;
  meeting: string;
  mentioned: string;
  milestone: string;
  name: string;
  note: string;
  num: number | string;
  orig: string;
  pb: string;
  ptr: string;
  pubPlace: string;
  publisher: string;
  ref: string;
  reg: string;
  relatedItem: string;
  respStmt: string;
  rs: string;
  series: string;
  sic: string;
  soCalled: string;
  term: string;
  textLang: string;
  time: Date | string;
  title: string;
  unclear: string;
  unit: string;
}

export type BibliographicCitation = string | BiblStructTagCitation | BiblTagCitation;

export interface CitationsFeature {
  citations: BibliographicCitation[];
  areComplete: boolean;
}
