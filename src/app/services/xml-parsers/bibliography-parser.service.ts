import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { EditionDataService } from '../edition-data.service';

function getStringFromTags(tagLabel: string, cit: Element) {
  let res = '';
  Array.from(cit.getElementsByTagName(tagLabel)).forEach(element => res += element.textContent.replace(/\s+/g, ' ') + ' ');

  return res.trim();
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
  private foundCits = { havingAllField: 0, total: 0 };
  private bibliographicCitations: BibliographicCitation[] = [];
  public biblTagChilds = Object.keys(new BiblClassKeysAimed()).concat(['bibl', 'date', 'num', 'time']);

  constructor(
    private edition: EditionDataService,
  ) {
  }

  public getBibliographicCitations(): Observable<CitationsFeature> {
    return this.edition.parsedEditionSource$.pipe(
      map(responses => {
        Array.from(responses.getElementsByTagName('bibl')).forEach(citation => {
          const res = {};
          this.biblTagChilds.forEach(biblTagChild => {
            res[biblTagChild] = getStringFromTags(biblTagChild, citation);
          });
          Object.values(res).every(x => (x === null || x === ''))
            ? this.getCurb(citation.textContent.replace(/\s+/g, ' ').trim(), true, this.foundCits.total)
            : this.getCurb(res as BibliographicCitation, true, this.foundCits.havingAllField, this.foundCits.total);
        });

        Array.from(responses.getElementsByTagName('biblStruct')).forEach(citation => {
          const biblStructCitation: BibliographicCitation = {
            analytic_authors: '',
            analytic_titles: '',
            monogr_authors: '',
            monogr_titles: '',
            monogr_editors: '',
            monogr_imprint_pubPlaces: '',
            monogr_imprint_publishers: '',
            monogr_imprint_dates: '',
            monogr_biblScopes: '',
            series_titles: '',
            series_biblScopes: '',
            notes: '',
          };
          Array.from(citation.getElementsByTagName('analytic')).forEach(features => {
            biblStructCitation.analytic_authors += ' ' + getStringFromTags('author', features);
            biblStructCitation.analytic_titles += ' ' + getStringFromTags('title', features);
          });
          Array.from(citation.getElementsByTagName('monogr')).forEach(features => {
            biblStructCitation.monogr_authors += ' ' + getStringFromTags('author', features);
            biblStructCitation.monogr_titles += ' ' + getStringFromTags('title', features);
            biblStructCitation.monogr_editors += ' ' + getStringFromTags('editor', features);
            Array.from(features.getElementsByTagName('imprint')).forEach(subFeatures => {
              biblStructCitation.monogr_imprint_pubPlaces += ' ' + getStringFromTags('pubPlace', subFeatures);
              biblStructCitation.monogr_imprint_publishers += ' ' + getStringFromTags('publisher', subFeatures);
              biblStructCitation.monogr_imprint_dates += ' ' + getStringFromTags('date', subFeatures);
            });
            biblStructCitation.monogr_biblScopes += ' ' + getStringFromTags('biblScope', features);
          });
          Array.from(citation.getElementsByTagName('series')).forEach(features => {
            biblStructCitation.series_titles += ' ' + getStringFromTags('title', features);
            biblStructCitation.series_biblScopes += ' ' + getStringFromTags('biblScope', features);
          });
          biblStructCitation.notes += ' ' + getStringFromTags('note', citation);
          this.getCurb(
            biblStructCitation,
            !Object.values(biblStructCitation).every(x => (x === '')),
            this.foundCits.havingAllField,
            this.foundCits.total);
        });

        return {
          citations: this.bibliographicCitations,
          areComplete: ((this.foundCits.havingAllField === this.foundCits.total) ? true : false),
        } as CitationsFeature;
      }),
      shareReplay(1),
    );
  }
  private getCurb(bibliographicCitation: BibliographicCitation, eventCond: boolean, ...args: number[]) {
    if (eventCond && !this.bibliographicCitations.includes(bibliographicCitation)) {
      this.bibliographicCitations.push(bibliographicCitation);
      args.forEach(el => el++);
    }
  }
}

interface BiblStructTagCitation {
  analytic_authors: string;
  analytic_titles: string;
  monogr_authors: string;
  monogr_titles: string;
  monogr_editors: string;
  monogr_imprint_pubPlaces: string;
  monogr_imprint_publishers: string;
  monogr_imprint_dates: string;
  monogr_biblScopes: string;
  series_titles: string;
  series_biblScopes: string;
  notes: string;
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
