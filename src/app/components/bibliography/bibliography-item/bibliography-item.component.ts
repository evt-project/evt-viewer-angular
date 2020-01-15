import { Component, Input, OnInit } from '@angular/core';
import { BibliographicCitation } from 'src/app/services/xml-parsers/bibliography-parser.service';

@Component({
  selector: 'evt-bibliography-item',
  templateUrl: './bibliography-item.component.html',
  styleUrls: ['./bibliography-item.component.scss'],
})
export class BibliographyItemComponent implements OnInit {
  @Input() biblField: BibliographicCitation;
  templateBiblCitData;
  ngOnInit() {
    this.templateBiblCitData = Object.values(this.biblField);
  }
}
