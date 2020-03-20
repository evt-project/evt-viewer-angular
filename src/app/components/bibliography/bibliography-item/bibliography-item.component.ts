import { Component, Input, OnInit } from '@angular/core';
import { BibliographicCitation } from 'src/app/models/evt-models';

@Component({
  selector: 'evt-bibliography-item',
  templateUrl: './bibliography-item.component.html',
  styleUrls: ['./bibliography-item.component.scss'],
})
export class BibliographyItemComponent implements OnInit {
  @Input() hasFields: boolean;
  @Input() bibliographicCitation: BibliographicCitation;
  public templateBiblCit;

  ngOnInit() {
    if (this.hasFields) {
      this.templateBiblCit = {};
      const values = Object.values(this.bibliographicCitation);
      const keys = Object.keys(this.bibliographicCitation);
      keys.forEach((k, i) => this.templateBiblCit[k] = values[i]);
    }
  }
}
