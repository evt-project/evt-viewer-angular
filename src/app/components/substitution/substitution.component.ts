import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Subst } from 'src/app/models/evt-models';
import { register } from 'src/app/services/component-register.service';
import { EditionlevelSusceptible, Highlightable, ShowDeletionsSusceptible, TextFlowSusceptible } from '../components-mixins';
import { AppConfig } from 'src/app/app.config';

export interface SubstitutionComponent extends EditionlevelSusceptible, Highlightable, TextFlowSusceptible, ShowDeletionsSusceptible { }

@Component({
  selector: 'evt-substitution',
  templateUrl: './substitution.component.html',
  styleUrls: ['./substitution.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

@register(Subst)
export class SubstitutionComponent {

  public substMarker = AppConfig.evtSettings.edition.showSubstitutionMarker;

  @Input() data: Subst;

  @Input() selectedLayer: string;


}
