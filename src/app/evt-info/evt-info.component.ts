import { Component } from '@angular/core';
import { register } from '../services/component-register.service';

@Component({
  selector: 'evt-evt-info',
  templateUrl: './evt-info.component.html',
  styleUrls: ['./evt-info.component.scss'],
})
@register
export class EvtInfoComponent {
}
