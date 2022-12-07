import { Component, Input } from '@angular/core';
import { Char } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-char',
  templateUrl: './char.component.html',
  styleUrls: ['./char.component.scss'],
})
@register(Char)
export class CharComponent {
  @Input() data: Char;
}
