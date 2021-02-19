import { Component, Input } from '@angular/core';

@Component({
  selector: 'evt-project-info-section',
  templateUrl: './project-info-section.component.html',
  styleUrls: ['./project-info-section.component.scss'],
})
export class ProjectInfoSectionComponent {
  @Input() label: string;
  @Input() sectionClass: string;
}
