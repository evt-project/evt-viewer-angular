import { Component } from '@angular/core';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-image-panel',
  templateUrl: './image-panel.component.html',
  styleUrls: ['./image-panel.component.scss'],
})
@register
export class ImagePanelComponent {
}
