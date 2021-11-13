import { Component, Input } from '@angular/core';
import { Namespace } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-namespace',
  templateUrl: './namespace.component.html',
  styleUrls: ['./namespace.component.scss'],
})
@register(Namespace)
export class NamespaceComponent {
  @Input() data: Namespace;
}
