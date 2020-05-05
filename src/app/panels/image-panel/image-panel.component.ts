import { Component } from '@angular/core';
import { AppConfig } from '../../app.config';

@Component({
  selector: 'evt-image-panel',
  templateUrl: './image-panel.component.html',
  styleUrls: ['./image-panel.component.scss'],
})
export class ImagePanelComponent {
  manifest = AppConfig.evtSettings.files.manifestURL !== '' && !!AppConfig.evtSettings.files.manifestURL
    ? AppConfig.evtSettings.files.manifestURL
    : undefined;
}
