import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
// tslint:disable-next-line: max-line-length
import { BibliographicCitation, BibliographyParserService, SortingParameters } from '../../services/xml-parsers/bibliography-parser.service';

@Component({
  selector: 'evt-bibliography',
  templateUrl: './bibliography.component.html',
  styleUrls: ['./bibliography.component.scss'],
})
export class BibliographyComponent implements OnDestroy {
  public biblCits: BibliographicCitation[] = [];
  private subscription: Subscription;
  public isComplete: boolean;
  selectAlphOrder: 'Descendent' | 'Ascendent';
  sortingField: Observable<SortingParameters>;
  selectSortByField: string;

  constructor(
    public bps: BibliographyParserService,
  ) {
    this.sortingField = this.bps.getSortingField();

    this.subscription = this.bps.getBibliographicCitations().subscribe(response => {
      this.isComplete = response.areComplete;
      this.biblCits = response.citations;
    });
  }

  sortBy(field: string) {
    if (field === 'Descendent') {
      this.sortByTitle().reverse();
    } else if (field === 'Ascendent' || field === 'Title') {
      this.sortByTitle();
    } else if (field === 'Author') {
      this.biblCits.sort((cit1, cit2) => {
        return cit1.authors.toLowerCase().localeCompare(cit2.authors.toLowerCase());
      });
    } else if (field === 'Date') {
      this.biblCits.sort((cit1, cit2) => {
        return cit1.dates.toLowerCase().localeCompare(cit2.dates.toLowerCase());
      });
    }
  }

  private sortByTitle() {
    return this.biblCits.sort((cit1, cit2) => {
      return cit1.titles.toLowerCase().localeCompare(cit2.titles.toLowerCase());
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
