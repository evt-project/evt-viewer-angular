import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BibliographicCitation } from 'src/app/models/evt-models';
import biblCitChildTags from 'src/assets/bibliographic-citation-childs/bibliographic-citation-childs.json';
import { BibliographyParserService } from '../../services/xml-parsers/bibliography-parser.service';

@Component({
  selector: 'evt-bibliography',
  templateUrl: './bibliography.component.html',
  styleUrls: ['./bibliography.component.scss'],
})
export class BibliographyComponent implements OnDestroy {
  public biblCits: BibliographicCitation[] = [];
  private subscriptions: Subscription[] = [];
  public areComplete: boolean;
  public styles = ['Chicago', 'APA'];
  private sortingFields = { asc: [] };
  public basicTwinFields = { author: 0, date: 0, title: 0 };
  public selectedStyle: string;
  public selectedField: string;
  public selectedAlphOrder: string;

  constructor(
    public biblParsService: BibliographyParserService,
    public http: HttpClient,
  ) {
    this.subscriptions.push(this.biblParsService.getBibliographicCitations().subscribe(response => {
      this.biblCits = response.citations;
      this.areComplete = response.areComplete;
    }));

    this.mapSortingFields('assets/i18n/it.json', 'assets/i18n/en.json');

    if (this.areComplete) {
      this.biblCits.forEach(biblCit => {
        Object.keys(biblCit).forEach(k => {
          if (['author', 'analyticAuthor', 'monogrAuthor'].includes(k) && biblCit[k].trim()) {
            this.basicTwinFields.author++;
          } else if (['date', 'monogrImprintDate'].includes(k) && biblCit[k].trim()) {
            this.basicTwinFields.date++;
          } else if (['title', 'monogrTitle'].includes(k) && biblCit[k].trim()) {
            this.basicTwinFields.title++;
          }
        });
      });
    }
  }

  private mapSortingFields(...paths: string[]) {
    paths.forEach(path => {
      this.subscriptions.push(this.http.get(path).subscribe(response => {
        Object.keys(response).forEach(key => {
          if (key === 'asc') {
            this.sortingFields.asc.push(response[key]);
          } else if (key === 'title' && this.areComplete) {
            Object.keys(this.biblCits[0]).includes('analyticTitle')
              ? this.sortingFields[response[key]] = 'analyticTitle'
              : this.sortingFields[response[key]] = 'title';
          } else if (key === 'date' && this.areComplete) {
            Object.keys(this.biblCits[0]).includes('monogrImprintDate')
              ? this.sortingFields[response[key]] = 'monogrImprintDate'
              : this.sortingFields[response[key]] = 'date';
          } else if (key === 'author' && this.areComplete) {
            Object.keys(this.biblCits[0]).includes('analyticAuthor')
              ? this.sortingFields[response[key]] = 'analyticAuthor'
              : this.sortingFields[response[key]] = 'author';
          }
        });
      }));
    });
  }

  private swapFields(orderStyle: string[]) {
    Array.from(document.getElementsByClassName('biblPar')).forEach(biblPar => {
      orderStyle.concat(biblCitChildTags.bibl).concat(biblCitChildTags.biblStruct).forEach(tagClass => {
        Array.from(biblPar.getElementsByClassName(tagClass)).forEach(tagClassElement => {
          if (tagClassElement.parentNode === biblPar) {
            biblPar.appendChild(tagClassElement);
          }
        });
      });
    });
  }

  swapBiblCit(selectedStyle: string) {
    selectedStyle === 'Chicago'
      ? this.swapFields(['author', 'analyticAuthor', 'date', 'title', 'analyticTitle', 'monogrTitle', 'editors', 'pubPlace'])
      : this.swapFields(['author', 'analyticAuthor', 'pubPlace', 'title', 'analyticTitle', 'pubPlace']);
  }

  private setSelectedItem(selectedField: string): string {
    let field: string;
    try {
      field = Object.values(selectedField)[1].trim();
    } catch (e) {
      field = 'Author';
    }

    return field;
  }

  sortBy(mode: string, selectedField: string): BibliographicCitation[] {
    const res = this.biblCits.sort((x, y) => {
      if (this.areComplete) {
        return x[
          this.sortingFields[
          this.setSelectedItem(selectedField)
          ]
        ].localeCompare(y[this.sortingFields[this.setSelectedItem(selectedField)]], undefined, { sensitivity: 'base' });
      }
      if (!this.areComplete) {
        return String(x).localeCompare(String(y), undefined, { sensitivity: 'base' });
      }
    });

    return this.sortingFields.asc.includes(this.setSelectedItem(mode))
      ? res
      : res.reverse();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
