import { Component, Input } from '@angular/core';
import { Text } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
@register(Text)
export class TextComponent {
  @Input() data: Text;
}
