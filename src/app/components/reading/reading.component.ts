import { Component, Input } from '@angular/core';
import { Reading } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { Highlightable } from '../components-mixins';
import { EditionLevelType } from 'src/app/app.config';

@Component({
  selector: 'evt-reading',
  templateUrl: './reading.component.html',
  styleUrls: ['./reading.component.scss'],
})
@register(Reading)
export class ReadingComponent extends Highlightable {
  @Input() data: Reading;
  @Input() editionLevel: EditionLevelType;
  @Input() withDeletions: boolean;
}
