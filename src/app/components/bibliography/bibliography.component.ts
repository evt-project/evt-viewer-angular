import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BibliographicCitation } from 'src/app/models/evt-models';
import { LanguagesFinderService } from '../../services/languages-finder.service';
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
  private sortingFields = {
    author: {
      labels: [],
      tags: [],
    },
    title: {
      labels: [],
      tags: [],
    },
    date: {
      labels: [],
      tags: [],
    },
    asc: {
      labels: [],
      tags: {},
    },
  };
  public basicTwinFields = { author: 0, date: 0, title: 0 };
  public selectedStyle: string;
  public selectedField: string;
  public selectedAlphOrder: string;
  private biblCitChildTags = {
    bibl: [],
    biblStruct: [],
  };

  constructor(
    public biblParsService: BibliographyParserService,
    public http: HttpClient,
    public langService: LanguagesFinderService,
  ) {
    this.subscriptions.push(this.biblParsService.getBibliographicCitations().subscribe(response => {
      this.biblCits = response.citations;
      this.areComplete = response.areComplete;
    }));

    this.langService.getLanguages().forEach(langFile => {
      this.subscriptions.push(this.http.get(langFile).subscribe(store => {
        for (const [k, v] of Object.entries(store)) {
          switch (k) {
            case 'author':
              this.sortingFields.author.labels.push(v);
              break;
            case 'title':
              this.sortingFields.title.labels.push(v);
              break;
            case 'date':
              this.sortingFields.date.labels.push(v);
              break;
            case 'asc':
              this.sortingFields.asc.labels.push(v);
              break;
          }
        }
      }));
    });

    if (this.areComplete) {
      this.biblCits.forEach(biblCit => {
        Object.keys(biblCit).forEach(k => {
          if (['author', 'analyticAuthor', 'monogrAuthor'].includes(k) && biblCit[k].trim()) {
            this.basicTwinFields.author++;
            this.biblParsService.pushIfNotExist(this.sortingFields.author.tags, k);
          } else if (['date', 'monogrImprintDate'].includes(k) && biblCit[k].trim()) {
            this.basicTwinFields.date++;
            this.biblParsService.pushIfNotExist(this.sortingFields.date.tags, k);
          } else if (['title', 'monogrTitle'].includes(k) && biblCit[k].trim()) {
            this.basicTwinFields.title++;
            this.biblParsService.pushIfNotExist(this.sortingFields.title.tags, k);
          }
        });
      });
      this.biblParsService.getTagsChilds().then(data => {
        const keys = ['bibl', 'biblStruct'];
        this.biblCitChildTags.bibl = data[keys[0]];
        this.biblCitChildTags.biblStruct = data[keys[1]];
      });
    }
  }

  private getSelectedField(selectedField: string): string {
    let i = 0;
    const a = Object.entries(this.sortingFields).slice(0, -1);
    try {
      selectedField = Object.values(selectedField)[1].trim();
      do {
        if (a[i][1].labels.includes(selectedField)) {
          return a[i][1].tags[0];
        }
        i++;
      } while (i < a.length);
    } catch (e) {
      return this.sortingFields.author.tags[0];
    }
  }

  private swapFields(orderStyle: string[]) {
    Array.from(document.getElementsByClassName('biblPar')).forEach(biblPar => {
      const biblTot = (this.biblCitChildTags.bibl.concat(this.biblCitChildTags.biblStruct)).filter(x => orderStyle.indexOf(x) === -1);
      orderStyle.concat(biblTot).forEach(tagClass => {
        Array.from(biblPar.getElementsByClassName(tagClass)).forEach(tagClassElement => {
          biblPar.appendChild(tagClassElement);
        });
      });
    });
  }

  swapBiblCit(selectedStyle: string) {
    selectedStyle === 'Chicago'
      ? this.swapFields(['author', 'analyticAuthor'])
      : this.swapFields(['date', 'monogrImprintDate']);
  }

  sortBy(mode: string, selectedField): BibliographicCitation[] {
    const res = this.biblCits.sort((x, y) => {
      return this.areComplete
        ? x[this.getSelectedField(selectedField)].localeCompare(y[this.getSelectedField(selectedField)], undefined, { sensitivity: 'base' })
        : (x as string).localeCompare(y as string, undefined, { sensitivity: 'base' });
    });
    try {
      mode = Object.values(mode)[1].trim();
    } catch (e) {
      mode = 'Ascendent';
    }

    return this.sortingFields.asc.labels.includes(mode)
      ? res
      : res.reverse();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
