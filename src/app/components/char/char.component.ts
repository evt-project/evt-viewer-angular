import { Component, Input } from '@angular/core';
import { Char } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EvtDynamicComponent } from '../components-mixins';

@Component({
  selector: 'evt-char',
  templateUrl: './char.component.html',
  styleUrls: ['./char.component.scss'],
})
@register(Char)
export class CharComponent extends EvtDynamicComponent {
  @Input() data: Char;
}
