import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class BibliographyParserService {

  private editionUrls = AppConfig.evtSettings.files.editionUrls || [];
  private bibliographicCitations: Array<string> = [];
  constructor(
    private http: HttpClient,
  ) {
  }

  public spotBibliographicCitations() {
    const parser = new DOMParser();
    this.editionUrls.forEach((path) => {
      this.http.get(path, { responseType: 'text' }).subscribe((response) => {
        Array.from(parser.parseFromString(response, 'text/xml').getElementsByTagName('bibl')).forEach(citation => {
          if (citation.getElementsByTagName('author').length === 0 &&
              citation.getElementsByTagName('title').length === 0 &&
              citation.getElementsByTagName('date').length === 0) {
            // unmarked citation
            if (!this.bibliographicCitations.includes(citation.textContent)) {
              console.log(citation.textContent);
            }
          } else {
            // TODO marked citation
          }
          /* if (!this.bibliographicCitations.includes(citation.textContent)) {

          }*/
          this.bibliographicCitations.push(citation.textContent);
        });
      });
    });
    this.bibliographicCitations = [];
  }
}
