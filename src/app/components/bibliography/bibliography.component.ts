import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'evt-bibliography',
  templateUrl: './bibliography.component.html',
  styleUrls: ['./bibliography.component.scss']
})
export class BibliographyComponent implements AfterViewInit {

  constructor( ) {
    const xmlFile = 'assets/data/edition.xml';
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', xmlFile, true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(this.response, 'text/xml');
        const listBibl = xmlDoc.getElementsByTagName('listBibl');
        listBibl[0].childNodes.forEach((field) => {
          if (!field.nodeValue) {
            console.log(field);
          }
        });
      }
    };
  }

  ngAfterViewInit() {
    (document.querySelectorAll('.cloosingRood')[0] as HTMLElement).onclick = () => {
      (document.querySelectorAll('.biblSpace')[0] as HTMLElement).style.display = 'none';
    };
  }
}
