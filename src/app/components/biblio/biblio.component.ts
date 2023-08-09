import { Component, Input } from '@angular/core';

@Component({
  selector: 'evt-biblio-entry',
  templateUrl: './biblio.component.html',
  styleUrls: ['./biblio.component.scss'],
})
export class BiblioEntryComponent {

  @Input() data;

  public showList = ['author','title','date','editor','publisher','pubPlace', 'citedRange'];
  public showAttrNames = false;
  public showEmptyValues = false;
  public inline = true;

}

