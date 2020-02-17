import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BibliographicCitation, BibliographyParserService } from '../../services/xml-parsers/bibliography-parser.service';

@Component({
  selector: 'evt-bibliography',
  templateUrl: './bibliography.component.html',
  styleUrls: ['./bibliography.component.scss'],
})
export class BibliographyComponent implements OnDestroy {
  public biblCits: BibliographicCitation[] = [];
  private subscriptions: Subscription[] = [];
  public isComplete: boolean;
  public styles = ['Chicago', 'APA'];
  private sortingFields;
  public selectedStyle: string;
  public selectedField: string;
  public selectedAlphOrder: string;

  constructor(
    public biblParsService: BibliographyParserService,
    public http: HttpClient,
  ) {
    this.subscriptions.push(this.biblParsService.getBibliographicCitations().subscribe(response => {
      this.biblCits = response.citations;
      this.isComplete = response.areComplete;
    }));
    if (this.isComplete) {
      this.sortingFields = {};
      this.mapSortingField('assets/i18n/it.json');
      this.mapSortingField('assets/i18n/en.json');
    }
  }

  private mapSortingField(path: string) {
    this.subscriptions.push(this.http.get(path).subscribe(response => {
      Object.keys(response).forEach(key => {
        if (key === 'author') {
          Object.keys(this.biblCits[0]).includes('analyticAuthor')
            ? this.sortingFields[response[key]] = 'analyticAuthor'
            : this.sortingFields[response[key]] = 'author';
        } else if (key === 'title') {
          Object.keys(this.biblCits[0]).includes('analyticTitle')
            ? this.sortingFields[response[key]] = 'analyticTitle'
            : this.sortingFields[response[key]] = 'title';
        } else if (key === 'date') {
          Object.keys(this.biblCits[0]).includes('monogrImprintDate')
            ? this.sortingFields[response[key]] = 'monogrImprintDate'
            : this.sortingFields[response[key]] = 'date';
        }
      });
    }));
  }

  private swapFields(orderStyle: string[]) {
    const biblPars = Array.from(document.getElementsByClassName('biblPar'));
    biblPars.forEach(biblPar => {
      orderStyle.concat(this.biblParsService.biblTagChilds).concat(this.biblParsService.biblStructTagChilds).forEach(tagClass => {
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
      field = Object.values(selectedField)[1];
    } catch (e) {
      field = 'Author';
    }

    return field;
  }

  sortBy(mode: string, selectedField: string): BibliographicCitation[] {
    const res = this.biblCits.sort((x, y) => {
      if (this.isComplete) {
        return x[
          this.sortingFields[
          this.setSelectedItem(selectedField)
          ]
        ].localeCompare(y[this.sortingFields[this.setSelectedItem(selectedField)]], undefined, { sensitivity: 'base' });
      }
      if (!this.isComplete) {
        return String(x).localeCompare(String(y), undefined, { sensitivity: 'base' });
      }
    });

    return this.setSelectedItem(mode) === 'Ascendent' || this.setSelectedItem(mode) === 'Ascendente'
      ? res
      : res.reverse();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
