import { Component, OnInit, Input } from '@angular/core';
import { TextData } from '../../models/parsed-elements';

@Component({
  selector: 'evt-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit {
  @Input() data: TextData;

  constructor() { }

  ngOnInit() {
  }

}
