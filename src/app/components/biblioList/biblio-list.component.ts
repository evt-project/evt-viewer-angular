import { Component, Input } from '@angular/core';

@Component({
  selector: 'evt-biblio-list',
  templateUrl: './biblio-list.component.html',
  styleUrls: ['./biblio-list.component.scss'],
})
export class BiblioListComponent {

  @Input() data;

}
