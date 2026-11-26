import { Component, Input } from '@angular/core';
import { Mod, Reading } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { AppConfig } from 'src/app/app.config';
import { EvtDynamicComponent } from '../components-mixins';

@Component({
  selector: 'evt-reading',
  templateUrl: './reading.component.html',
  styleUrls: ['./reading.component.scss'],
})
@register(Reading)
export class ReadingComponent extends EvtDynamicComponent {
  @Input() data: Reading;

  public ModType = Mod;

  getLayerColor(changeLayer) {
    const layerColors = AppConfig.evtSettings.edition.changeSequenceView.layerColors;
    if ((changeLayer) && (layerColors[changeLayer.replace('#', '')])) {
      return layerColors[changeLayer.replace('#', '')];
    }

    return 'black';
  }

}
