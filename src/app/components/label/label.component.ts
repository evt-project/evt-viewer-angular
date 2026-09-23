import { Component, Input, OnInit } from '@angular/core';
import { GenericElement } from 'src/app/models/evt-models';
import { ParseResult } from 'src/app/services/xml-parsers/parser-models';

@Component({
  selector: 'evt-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {
  @Input() data: ParseResult<GenericElement>;

  constructor() { }

  ngOnInit(): void {
  }

}
