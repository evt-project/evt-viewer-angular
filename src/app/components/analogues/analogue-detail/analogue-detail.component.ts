import { Component, Input } from '@angular/core';

@Component({
  selector: 'evt-analogue-detail',
  templateUrl: './analogue-detail.component.html',
  styleUrls: ['./analogue-detail.component.scss','../../sources/sources.component.scss'],
})
export class AnalogueDetailComponent {

  @Input() analogue;

}

