import { Component, Input } from '@angular/core';

@Component({
  selector: 'evt-source-detail',
  templateUrl: './source-detail.component.html',
  styleUrls: ['../../sources/sources.component.scss'],
})
export class SourceDetailComponent {

  @Input() source;

}

