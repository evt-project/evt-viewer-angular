import { Component, Input } from '@angular/core';

@Component({
  selector: 'evt-header-section',
  templateUrl: './header-section.component.html',
  styleUrls: ['./header-section.component.scss'],
})
export class HeaderSectionComponent {
  @Input() label: string;
  @Input() additionalClass: string;
  @Input() inlineLabel: boolean;
}
