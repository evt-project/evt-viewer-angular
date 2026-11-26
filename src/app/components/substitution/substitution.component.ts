import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Subst } from 'src/app/models/evt-models';
import { register } from 'src/app/services/component-register.service';
import { AppConfig } from 'src/app/app.config';
import { EditorialConventionLayoutData } from 'src/app/directives/editorial-convention-layout.directive';
import { EvtDynamicComponent } from '../components-mixins';

@Component({
  selector: 'evt-substitution',
  templateUrl: './substitution.component.html',
  styleUrls: ['./substitution.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

@register(Subst)
export class SubstitutionComponent extends EvtDynamicComponent {

  public substMarker = AppConfig.evtSettings.edition.showSubstitutionMarker;

  @Input() data: Subst;


  get editorialAddConventionData(): EditorialConventionLayoutData {
    return {
      name: 'add',
      attributes: this.data.add.attributes,
      editionLevel: this.editionLevel,
    };
  }

  get editorialDelConventionData(): EditorialConventionLayoutData {
    return {
      name: 'del',
      attributes: this.data.del.attributes,
      editionLevel: this.editionLevel,
    };
  }
}
