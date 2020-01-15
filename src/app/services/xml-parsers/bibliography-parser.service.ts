import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AppConfig } from 'src/app/app.config';

function getStringFromTags(tagLabel: string, cit: Element) {
  let res = '';
  Array.from(cit.getElementsByTagName(tagLabel)).map(element => res += element.textContent.replace(/\s+/g, ' ') + ' ');

  return res;
}

@Injectable({
  providedIn: 'root',
})
export class BibliographyParserService {
  private editionUrls = AppConfig.evtSettings.files.editionUrls || [];
  private findedCits = { complete: 0, total: 0 };

  constructor(
    private http: HttpClient,
  ) {
  }

  public getBibliographicCitations(): Observable<CitationsFeature> {
    const parser = new DOMParser();
    const bibliographicCitations: BibliographicCitation[] = [];

    return forkJoin(this.editionUrls.map((path) => this.http.get(path, { responseType: 'text' }))).pipe(
      map(responses => {
        responses.map(response => {
          Array.from(parser.parseFromString(response, 'text/xml').getElementsByTagName('bibl')).map(citation => {
            if (citation.getElementsByTagName('author').length === 0 &&
              citation.getElementsByTagName('title').length === 0 &&
              citation.getElementsByTagName('date').length === 0) {
              const interfacedCitation: BibliographicCitation = {
                titles: citation.textContent.replace(/\s+/g, ' '),
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
        });

        return { citations: bibliographicCitations, areComplete: ((this.findedCits.complete === this.findedCits.total) ? true : false) };
      }),
      shareReplay(1),
    );
  }

  public getSortingField() {
    const source = 'assets/i18n/en.json';
    const b = 'BIBLIOGRAPHY';

    return this.http.get<SortingParameters>(source).pipe(
      map((res) => (
        {

          // tslint:disable-next-line: no-string-literal
          alphOrder: [res[b]['ASC'], res[b]['DESC']],
          // tslint:disable-next-line: no-string-literal
          sortBy: [res[b]['AUTHOR'], res[b]['TITLE'], res[b]['DATE']],
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
