import { Component, OnInit, Input } from '@angular/core';
import { TextData } from '../../models/parsed-elements';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
@register
export class TextComponent implements OnInit {
  @Input() data: TextData;

  constructor() { }

  ngOnInit() {
  }

}
