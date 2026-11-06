import { Component, Input, OnInit } from '@angular/core';
import { Lacuna } from 'src/app/models/evt-models';
import { register } from 'src/app/services/component-register.service';
import { EvtDynamicComponent } from '../components-mixins';

@Component({
  selector: 'evt-lacuna',
  templateUrl: './lacuna.component.html',
  styleUrls: ['./lacuna.component.scss']
})
@register(Lacuna)
export class LacunaComponent extends EvtDynamicComponent implements OnInit {
  @Input() data: Lacuna;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }
}
