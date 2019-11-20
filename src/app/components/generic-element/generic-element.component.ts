import { Component, Input } from '@angular/core';
import { GenericElementData } from '../../models/parsed-elements';

@Component({
  selector: 'evt-generic-element',
  templateUrl: './generic-element.component.html',
  styleUrls: ['./generic-element.component.scss']
})
export class GenericElementComponent {

  @Input() data: GenericElementData;

}
