import { Component, Input } from '@angular/core';
import { GenericElementData } from '../../models/parsed-elements';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-generic-element',
  templateUrl: './generic-element.component.html',
  styleUrls: ['./generic-element.component.scss']
})
@register
export class GenericElementComponent {

  @Input() data: GenericElementData;

}
