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
  private subscription: Subscription;
  public isComplete: boolean;
  selectedAlphOrder: 'Ascendent';
  selectedField: 'Author';
  selectedStyle: 'Chicago';
  features: string[] = ['Author', 'Title', 'Date'];
  styles: string[] = ['Chicago', 'APA'];
  alphOrders: string[] = ['Ascendent', 'Descendent'];

  constructor(
    public bps: BibliographyParserService,
    public http: HttpClient,
  ) {

    this.subscription = this.bps.getBibliographicCitations().subscribe(response => {
      this.biblCits = response.citations;
      this.isComplete = response.areComplete;
    });
    this.swap();
    this.isComplete
      ? this.sortBy('Ascendent', this.selectedField)
      : this.sortBy('Ascendent');
  }

  swap() {
    const biblPars = document.getElementsByClassName('biblPar');

    const authors = document.getElementsByClassName('authors');
    const dates = document.getElementsByClassName('dates');
    const titles = document.getElementsByClassName('titles');
    const editors = document.getElementsByClassName('editors');
    const pubPlaces = document.getElementsByClassName('pubPlaces');
    const publishers = document.getElementsByClassName('publishers');
    const biblScopes = document.getElementsByClassName('biblScopes');
    const series = document.getElementsByClassName('series');

    const analyticAuthors = document.getElementsByClassName('analytic_author');
    const analyticTitles = document.getElementsByClassName('analytic_titles');
    const monogrAuthors = document.getElementsByClassName('monogr_authors');
    const monogrTitles = document.getElementsByClassName('monogr_titles');
    const monogrEditors = document.getElementsByClassName('monogr_editors');
    const monogrImprintPubPlaces = document.getElementsByClassName('monogr_imprint_pubPlaces');
    const monogrImprintPublishers = document.getElementsByClassName('monogr_imprint_publishers');
    const monogrImprintDates = document.getElementsByClassName('monogr_imprint_dates');
    const monogrBiblScopes = document.getElementsByClassName('monogr_biblScopes');
    const seriesTitles = document.getElementsByClassName('series_titles');
    const seriesBiblScopes = document.getElementsByClassName('series_biblScopes');

    const notes = document.getElementsByClassName('notes');

    const ps = Array.from(biblPars);
    let a: HTMLCollection[];
    if (this.selectedStyle === 'Chicago') {
      a = [
        authors,
        analyticAuthors,
        dates,
        titles,
        analyticTitles,
        monogrTitles,
        monogrAuthors,
        monogrTitles,
        monogrEditors,
        monogrBiblScopes,
        seriesTitles,
        seriesBiblScopes,
        series,
        notes,
        editors,
        pubPlaces,
        publishers,
        biblScopes];
    } else {
      a = [
        authors,
        analyticAuthors,
        dates,
        titles,
        analyticTitles,
        monogrTitles,
        monogrAuthors,
        monogrTitles,
        monogrImprintPubPlaces,
        monogrImprintPublishers,
        monogrImprintDates,
        monogrEditors,
        monogrBiblScopes,
        editors,
        pubPlaces,
        publishers,
        biblScopes,
        seriesTitles,
        seriesBiblScopes,
        series,
        notes];
    }
    for (let i = 0; i < ps.length; i++) {
      a.forEach(tag => {
        if (tag[i] !== undefined) {
          ps[i].appendChild(tag[i]);
        }
      });
    }
  }

  sortBy(mode: 'Ascendent' | 'Descendent', field?: string): BibliographicCitation[] {
    const res = this.biblCits.sort((x, y) => {
      if (this.isComplete) {
        if (field === 'Title') {
          const t = 'title';
          try {
            return x[t].localeCompare(y[t], undefined, { sensitivity: 'base' });
          } catch (e) {
            const at = 'analytic_titles';

            return x[at].localeCompare(y[at], undefined, { sensitivity: 'base' });
          }
        } else if (field === 'Date') {
          const d = 'dates';
          try {
            return x[d].localeCompare(y[d], undefined, { sensitivity: 'base' });
          } catch (e) {
            const mid = 'monogr_imprint_dates';

            return x[mid].localeCompare(y[mid], undefined, { sensitivity: 'base' });
          }
        } else {
          const a = 'authors';
          try {
            return x[a].localeCompare(y[a], undefined, { sensitivity: 'base' });
          } catch (e) {
            const an = 'analytic_authors';

            return x[an].localeCompare(y[an], undefined, { sensitivity: 'base' });
          }
        }
      } else {
        return String(x).localeCompare(String(y), undefined, { sensitivity: 'base' });
      }
    });

    return mode === 'Ascendent'
      ? res
      : res.reverse();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
