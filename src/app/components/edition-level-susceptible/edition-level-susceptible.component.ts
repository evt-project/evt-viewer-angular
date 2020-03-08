import { Component, Input } from '@angular/core';
import { EditionLevelType } from '../../app.config';

@Component({
  selector: 'evt-edition-level-susceptible',
  template: '',
})
export class EditionLevelSusceptibleComponent {
  @Input() editionLevel: EditionLevelType;
}
