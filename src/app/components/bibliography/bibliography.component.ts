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
  pageData: import("src/app/models/evt-models").PageData[];

  constructor(
    public xmlParser: StructureXmlParserService,
  ) {
    console.log("don't think the bibliography is here... but I am proud to have read this data with my new skills!");
    this.subscription = this.xmlParser.getPages().subscribe((response) => {
      response.forEach(function (value) {
        console.log(value);
      }); 
    });
  }

  ngAfterViewInit(){
    (<HTMLElement>document.querySelectorAll('.cloosingRood')[0]).onclick = function() {
      (<HTMLElement>document.querySelectorAll('.biblSpace')[0]).style.display = "none";
    }
  }
}
