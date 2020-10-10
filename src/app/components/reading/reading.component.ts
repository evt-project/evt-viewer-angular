import { Component, Input } from '@angular/core';
import { Reading } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-reading',
  templateUrl: './reading.component.html',
  styleUrls: ['./reading.component.scss'],
})
@register(Reading)
export class ReadingComponent {
  @Input() data: Reading;
}
