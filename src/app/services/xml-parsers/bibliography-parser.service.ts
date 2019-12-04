import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class BibliographyParserService {

  private editionUrls = AppConfig.evtSettings.files.editionUrls || [];
  private bibliographicCitations: Array<BibliographicCitation> = [];

  constructor(
    private http: HttpClient,
  ) {
    const parser = new DOMParser();
    this.editionUrls.forEach((path) => {
      this.http.get(path, { responseType: 'text' }).subscribe((response) => {
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
          this.bibliographicCitations.forEach(biblCit => {
            console.log(((biblCit.author === undefined) ? '' : biblCit.author),
                        ((biblCit.title === undefined) ? '' : biblCit.title),
                        ((biblCit.date === undefined) ? '' : biblCit.date));
          });
      });
    });
  }
}

export interface BibliographicCitation {
  author?: HTMLCollectionOf<Element>;
  title: string;
  date?: Element;
}
