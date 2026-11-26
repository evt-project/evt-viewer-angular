import { Component, Input } from '@angular/core';
import { History } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EvtDynamicComponent } from '../components-mixins';

@Component({
  selector: 'evt-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})

@register(History)
export class HistoryComponent extends EvtDynamicComponent {
  @Input() data: History;

}
