import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BibliographicCitation } from 'src/app/models/evt-models';
import biblCitChildTags from 'src/assets/bibliographic-citation-childs/bibliographic-citation-childs.json';
import { EditionDataService } from '../edition-data.service';

function getStringFromTags(tagLabel: string, cit: Element): string {
  let res = '';
  Array.from(cit.getElementsByTagName(tagLabel)).forEach(element => res += element.textContent.replace(/\s+/g, ' ') + ' ');

  return res.trim();
}

function checkTwins(...args: string[]): boolean {
  let counter = 0;
  for (const x of args) {
    if (x && (++counter > 1)) {
      return true;
    }
  }

  return false;
}

@Injectable({
  providedIn: 'root',
})
export class BibliographyParserService {
  private foundCits = { havingFields: 0, total: 0 };
  private bibliographicCitations = { biblSimples: [], biblComplex: [] };

  constructor(
    private edition: EditionDataService,
    public http: HttpClient,
  ) {
  }

  public getBibliographicCitations(): Observable<CitationsFeature> {
    return this.edition.parsedEditionSource$.pipe(
      map(responses => {
        Array.from(responses.getElementsByTagName('bibl')).forEach(citation => {
          const res = {};
          biblCitChildTags.bibl.forEach(biblTagChild => {
            res[biblTagChild] = getStringFromTags(biblTagChild, citation);
          });
          this.getCurb(
            checkTwins(getStringFromTags('author', citation), getStringFromTags('title', citation), getStringFromTags('date', citation)),
            citation.textContent.replace(/\s+/g, ' ').trim() as BibliographicCitation,
            res as BibliographicCitation,
          );
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
            series: '',
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
          biblStructCitation.series += ' ' + getStringFromTags('series', citation);
          biblStructCitation.note += ' ' + getStringFromTags('note', citation);
          this.getCurb(
            checkTwins(
              biblStructCitation.analyticAuthor, biblStructCitation.analyticTitle, biblStructCitation.monogrImprintDate as string,
            ) || checkTwins(
              biblStructCitation.monogrAuthor, biblStructCitation.monogrTitle, biblStructCitation.monogrImprintDate as string,
            ),
            citation.textContent.replace(/\s+/g, ' ').trim() as BibliographicCitation,
            biblStructCitation,
          );
        });
        console.log(this.foundCits.havingFields, this.foundCits.total);

        return {
          citations: ((this.foundCits.havingFields === this.foundCits.total)
            ? this.bibliographicCitations.biblComplex
            : this.bibliographicCitations.biblSimples),
          areComplete: ((this.foundCits.havingFields === this.foundCits.total) ? true : false),
        } as CitationsFeature;
      }),
      shareReplay(1),
    );
  }
  private getCurb(twoTwinsLeast: boolean, ...biblCits: BibliographicCitation[]) {
    this.bibliographicCitations.biblSimples.push(biblCits[0]);
    this.bibliographicCitations.biblComplex.push(biblCits[1]);
    this.foundCits.total++;
    if (twoTwinsLeast) {
      this.foundCits.havingFields++;
    }
  }
}

interface CitationsFeature {
  citations: BibliographicCitation[];
  areComplete: boolean;
}
