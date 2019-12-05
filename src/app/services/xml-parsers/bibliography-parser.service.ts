import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BibliographyParserService {

  private editionUrls = AppConfig.evtSettings.files.editionUrls || [];
  private bibliographicCitations: Array<BibliographicCitation> = [];

  constructor(
    private http: HttpClient,
  ) {
  }

  private getHttpCallsOBSStream() {
    return this.editionUrls.map((path) =>  this.http.get(path, { responseType: 'text'}));
  }

  public getBibliographicCitations() {
    const parser = new DOMParser();
    forkJoin(this.getHttpCallsOBSStream()).subscribe((responses) => {
      responses.forEach(response => {
        Array.from(parser.parseFromString(response, 'text/xml').getElementsByTagName('bibl')).forEach(citation => {
          if (citation.getElementsByTagName('author').length === 0 &&
              citation.getElementsByTagName('title').length === 0 &&
              citation.getElementsByTagName('date').length === 0) {
            const interfacedCitation: BibliographicCitation = {
              title: citation.textContent.replace(/\s+/g, ' '),
            };
            if (!this.bibliographicCitations.includes(interfacedCitation)) { this.bibliographicCitations.push(interfacedCitation); }
          } else {
            const interfacedCitation: BibliographicCitation = {
              author: citation.getElementsByTagName('author'),
              title: String(citation.getElementsByTagName('title')[0]).replace(/\s+/g, ' '),
              date: citation.getElementsByTagName('date')[0],
            };
            if (!this.bibliographicCitations.includes(interfacedCitation)) { this.bibliographicCitations.push(interfacedCitation); }
          }
        });
      });
    });
    return this.bibliographicCitations;
  }
}




export interface BibliographicCitation {
  author?: HTMLCollectionOf<Element>;
  title: string;
  date?: Element;
}
