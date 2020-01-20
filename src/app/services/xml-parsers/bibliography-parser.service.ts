import { HttpClient } from '@angular/common/http';
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
    private http: HttpClient,
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
            const interfacedCitation: BibliographicCitation = {
              titles: citation.textContent.replace(/\s+/g, ' ').trim(),
            };
            if (!bibliographicCitations.includes(interfacedCitation)) {
              bibliographicCitations.push(interfacedCitation);
              this.findedCits.total++;
            }
          } else {
            const authors: string = getStringFromTags('author', citation);
            const titles: string = getStringFromTags('title', citation);
            const dates: string = getStringFromTags('date', citation);
            const interfacedCitation: BibliographicCitation = { authors, titles, dates };
            if (!bibliographicCitations.includes(interfacedCitation)) {
              bibliographicCitations.push(interfacedCitation);
              this.findedCits.complete++;
              this.findedCits.total++;
            }
          }
        });

        return { citations: bibliographicCitations, areComplete: ((this.findedCits.complete === this.findedCits.total) ? true : false) };
      }),
      shareReplay(1),
    );
  }

  public getSortingField() {
    const source = 'assets/i18n/en.json';
    const b = 'BIBLIOGRAPHY';
    const asc = 'ASC';
    const desc = 'DESC';
    const author = 'AUTHOR';
    const title = 'TITLE';
    const date = 'DATE';

    return this.http.get<SortingParameters>(source).pipe(
      map((res) => (
        {
          alphOrder: [res[b][asc], res[b][desc]],
          sortBy: [res[b][author], res[b][title], res[b][date]],
        }
      )),
    );
  }
}

export interface BibliographicCitation {
  authors?: string;
  titles: string;
  dates?: string;
}

export interface SortingParameters {
  style?: string[];
  sortBy?: string[];
  alphOrder: string[];
}

export interface CitationsFeature {
  citations: BibliographicCitation[];
  areComplete: boolean;
}
