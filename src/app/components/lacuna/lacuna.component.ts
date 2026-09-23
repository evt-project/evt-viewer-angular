import { Component, Input, OnInit } from '@angular/core';
import { Lacuna } from 'src/app/models/evt-models';
import { register } from 'src/app/services/component-register.service';

@Component({
  selector: 'evt-lacuna',
  templateUrl: './lacuna.component.html',
  styleUrls: ['./lacuna.component.scss']
})
@register(Lacuna)
export class LacunaComponent implements OnInit {
  @Input() data: Lacuna;

  constructor() { }

  ngOnInit(): void {
  }
}
