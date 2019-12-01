import { Component, AfterViewInit } from '@angular/core';
import { StructureXmlParserService } from 'src/app/services/xml-parsers/structure-xml-parser.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'evt-bibliography',
  templateUrl: './bibliography.component.html',
  styleUrls: ['./bibliography.component.scss']
})
export class BibliographyComponent implements AfterViewInit {
  subscription: Subscription;
  pageData: import('src/app/models/evt-models').PageData[];

  constructor(
    public xmlParser: StructureXmlParserService,
  ) {
    console.log(`don't think the bibliography is here... but I am proud to have read this data with my new skills!`);
    this.subscription = this.xmlParser.getPages().subscribe((response) => {
      response.forEach((value) => {
        console.log(value);
      });
    });
  }

  ngAfterViewInit() {
    (document.querySelectorAll('.cloosingRood')[0] as HTMLElement).onclick = () => {
      (document.querySelectorAll('.biblSpace')[0] as HTMLElement).style.display = 'none';
    };
  }
}
