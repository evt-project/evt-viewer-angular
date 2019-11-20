import { Component, OnInit } from '@angular/core';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-sources-panel',
  templateUrl: './sources-panel.component.html',
  styleUrls: ['./sources-panel.component.scss']
})
@register
export class SourcesPanelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
