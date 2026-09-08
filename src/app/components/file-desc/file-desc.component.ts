import { Component, Input } from '@angular/core';
import { FileDesc } from 'src/app/models/evt-models';
import { register } from 'src/app/services/component-register.service';
import { EvtDynamicComponent } from '../components-mixins';

@Component({
  selector: 'evt-file-desc',
  templateUrl: './file-desc.component.html',
  styleUrls: ['./file-desc.component.scss'],
})
@register(FileDesc)
export class FileDescComponent extends EvtDynamicComponent {
  @Input() data: FileDesc;
}
