import { Component, Input } from '@angular/core';
import { BibliographicCitation } from 'src/app/services/xml-parsers/bibliography-parser.service';

@Component({
  selector: 'evt-bibliography-item',
  templateUrl: './bibliography-item.component.html',
  styleUrls: ['./bibliography-item.component.scss'],
})
export class BibliographyItemComponent {
  @Input() biblField: BibliographicCitation;
  @Input() authors: string;
  @Input() titles: string;
  @Input() editors: string;
  @Input() pubPlaces: string;
  @Input() publishers: string;
  @Input() dates: string;
  @Input() biblScopes: string;
  @Input() notes: string;
  @Input() series: string;
  @Input() analyticAuthors: string;
  @Input() analyticTitles: string;
  @Input() monogrAuthors: string;
  @Input() monogrTitles: string;
  @Input() monogrEditors: string;
  @Input() monogrImprintPubPlaces: string;
  @Input() monogrImprintPublishers: string;
  @Input() monogrImprintDates: string;
  @Input() monogrBiblScopes: string;
  @Input() seriesTitles: string;
  @Input() seriesBiblScopes: string;
}
