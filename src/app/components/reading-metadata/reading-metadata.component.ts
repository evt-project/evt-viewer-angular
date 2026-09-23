import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'evt-reading-metadata',
  templateUrl: './reading-metadata.component.html',
  styleUrls: ['./reading-metadata.component.scss']
})
export class ReadingMetadataComponent implements OnInit {

  @Input() metadata: Metadata;

  constructor() { }

  ngOnInit(): void {
  }

}

export interface Metadata {
  key: string;
  value: string;
}
