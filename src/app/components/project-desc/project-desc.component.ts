import { Component, Input } from '@angular/core';
import { ProjectDesc } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-project-desc',
  templateUrl: './project-desc.component.html',
  styleUrls: ['./project-desc.component.scss'],
})
@register(ProjectDesc)
export class ProjectDescComponent {
  @Input() data: ProjectDesc;
}
