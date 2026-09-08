import { Component, Input } from '@angular/core';
import { EditorialDecl } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EvtDynamicComponent } from '../components-mixins';

@Component({
  selector: 'evt-editorial-decl',
  templateUrl: './editorial-decl.component.html',
  styleUrls: ['./editorial-decl.component.scss'],
})
@register(EditorialDecl)
export class EditorialDeclComponent extends EvtDynamicComponent {
  @Input() data: EditorialDecl;
}
