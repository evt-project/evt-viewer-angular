import { Component, Input } from '@angular/core';
import { Deletion, Subst } from 'src/app/models/evt-models';
import { register } from 'src/app/services/component-register.service';
import { EditionlevelSusceptible, Highlightable, TextFlowSusceptible } from '../components-mixins';

export interface SubstitutionComponent extends EditionlevelSusceptible, Highlightable, TextFlowSusceptible { }

@Component({
  selector: 'evt-substitution',
  templateUrl: './substitution.component.html',
  styleUrls: ['./substitution.component.scss'],
})

@register(Subst)
export class SubstitutionComponent {
  @Input() data: Subst;

public Deletion = Deletion;

}
