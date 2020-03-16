import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BibliographicCitation } from 'src/app/models/evt-models';
import biblCitChildTags from 'src/assets/bibliography-features/bibliographic-citation-childs.json';
import { EditionDataService } from '../edition-data.service';

function getStringFromTags(tagLabel: string, cit: Element): string {
  return Array.from(cit.getElementsByTagName(tagLabel)).reduce((x, y) => x + y.textContent.replace(/\s+/g, ' '), '').trim();
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
        const areAllComplex: boolean = (this.foundCits.havingFields === this.foundCits.total);

        return {
          citations: (areAllComplex ? this.bibliographicCitations.biblComplex : this.bibliographicCitations.biblSimples),
          areComplete: areAllComplex,
        } as CitationsFeature;
      }),
      shareReplay(1),
    );
  }

  public pushIfNotExist(arr, element) {
    if (!arr.includes(element)) {
      arr.push(element);
    }
  }

  private getCurb(twoTwinsLeast: boolean, ...biblCits: BibliographicCitation[]) {
    this.pushIfNotExist(this.bibliographicCitations.biblSimples, biblCits[0]);
    this.pushIfNotExist(this.bibliographicCitations.biblComplex, biblCits[1]);
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
