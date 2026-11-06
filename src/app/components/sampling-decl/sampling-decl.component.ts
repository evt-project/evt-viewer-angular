import { Component, Input } from '@angular/core';
import { SamplingDecl } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EvtDynamicComponent } from '../components-mixins';

@Component({
  selector: 'evt-sampling-decl',
  templateUrl: './sampling-decl.component.html',
  styleUrls: ['./sampling-decl.component.scss'],
})
@register(SamplingDecl)
export class SamplingDeclComponent extends EvtDynamicComponent {
  @Input() data: SamplingDecl;
}
