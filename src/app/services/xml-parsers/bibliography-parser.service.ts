import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { EditionDataService } from '../edition-data.service';

function getStringFromTags(tagLabel: string, cit: Element) {
  let res = '';
  Array.from(cit.getElementsByTagName(tagLabel)).map(element => res += element.textContent.replace(/\s+/g, ' ') + ' ');

  return res.trim();
}

@Injectable({
  providedIn: 'root',
})
export class BibliographyParserService {
  private findedCits = { complete: 0, total: 0 };

  constructor(
    private edition: EditionDataService,
  ) {
  }

  public getBibliographicCitations(): Observable<CitationsFeature> {
    const bibliographicCitations: BibliographicCitation[] = [];

    return this.edition.parsedEditionSource$.pipe(
      map(responses => {
        Array.from(responses.getElementsByTagName('bibl')).map(citation => {
          if (citation.getElementsByTagName('author').length === 0 &&
            citation.getElementsByTagName('title').length === 0 &&
            citation.getElementsByTagName('date').length === 0) {
            const biblCitation: BibliographicCitation = citation.textContent.replace(/\s+/g, ' ').trim();
            if (!bibliographicCitations.includes(biblCitation)) {
              bibliographicCitations.push(biblCitation);
              this.findedCits.total++;
            }
          } else {
            const authors: string = getStringFromTags('author', citation);
            const titles: string = getStringFromTags('title', citation);
            const dates: string = getStringFromTags('date', citation);
            const editors: string = getStringFromTags('editor', citation);
            const pubPlaces: string = getStringFromTags('pubPlace', citation);
            const publishers: string = getStringFromTags('publisher', citation);
            const biblScopes: string = getStringFromTags('biblScope', citation);
            const notes: string = getStringFromTags('note', citation);
            const series: string = getStringFromTags('series', citation);
            const biblCitation: BibliographicCitation = {
              authors,
              titles,
              dates,
              editors,
              pubPlaces,
              publishers,
              biblScopes,
              notes,
              series,
            };
            if (!bibliographicCitations.includes(biblCitation)) {
              bibliographicCitations.push(biblCitation);
              this.findedCits.complete++;
              this.findedCits.total++;
            }
          }
        });

        Array.from(responses.getElementsByTagName('biblStruct')).map(citation => {
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
          Array.from(citation.getElementsByTagName('analytic')).map(features => {
            biblStructCitation.analytic_authors += ' ' + getStringFromTags('author', features);
            biblStructCitation.analytic_titles += ' ' + getStringFromTags('title', features);
          });
          Array.from(citation.getElementsByTagName('monogr')).map(features => {
            biblStructCitation.monogr_authors += ' ' + getStringFromTags('author', features);
            biblStructCitation.monogr_titles += ' ' + getStringFromTags('title', features);
            biblStructCitation.monogr_editors += ' ' + getStringFromTags('editor', features);
            Array.from(features.getElementsByTagName('imprint')).map(subFeatures => {
              biblStructCitation.monogr_imprint_pubPlaces += ' ' + getStringFromTags('pubPlace', subFeatures);
              biblStructCitation.monogr_imprint_publishers += ' ' + getStringFromTags('publisher', subFeatures);
              biblStructCitation.monogr_imprint_dates += ' ' + getStringFromTags('date', subFeatures);
            });
            biblStructCitation.monogr_biblScopes += ' ' + getStringFromTags('biblScope', features);
          });
          Array.from(citation.getElementsByTagName('series')).map(features => {
            biblStructCitation.series_titles += ' ' + getStringFromTags('title', features);
            biblStructCitation.series_biblScopes += ' ' + getStringFromTags('biblScope', features);
          });
          biblStructCitation.notes += ' ' + getStringFromTags('note', citation);
          if (!Object.values(biblStructCitation).every(x => (x === '')) &&
            !bibliographicCitations.includes(biblStructCitation)) {
            bibliographicCitations.push(biblStructCitation);
            this.findedCits.complete++;
            this.findedCits.total++;
          }
        });

        return { citations: bibliographicCitations, areComplete: ((this.findedCits.complete === this.findedCits.total) ? true : false) };
      }),
      shareReplay(1),
    );
  }
}

interface BiblStructCitation {
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
interface BiblCitation {
  authors: string;
  titles: string;
  dates: string;
  editors: string;
  pubPlaces: string;
  publishers: string;
  biblScopes: string;
  notes: string;
  series: string;
}
export type BibliographicCitation = string | BiblStructCitation | BiblCitation;

export interface CitationsFeature {
  citations: BibliographicCitation[];
  areComplete: boolean;
}
