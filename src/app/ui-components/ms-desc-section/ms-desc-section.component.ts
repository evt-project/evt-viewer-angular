import { Component, Input } from '@angular/core';

@Component({
  selector: 'evt-ms-desc-section',
  templateUrl: './ms-desc-section.component.html',
  styleUrls: ['./ms-desc-section.component.scss'],
})
export class MsDescSectionComponent {
  @Input() label: string;
  @Input() additionalClass: string;
  @Input() inlineLabel: boolean;
  @Input() nestedElement: boolean;
  @Input() underline: boolean;
}
