import { Component, Input } from '@angular/core';
import { map, tap } from 'rxjs/operators';

import { NamedEntityRef } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EntitiesSelectService } from '../../services/entities-select.service';
import { EVTModelService } from '../../services/evt-model.service';
import { EVTStatusService } from '../../services/evt-status.service';
import { EditionlevelSusceptible, Highlightable, TextFlowSusceptible } from '../components-mixins';

export interface NamedEntityRefComponent extends EditionlevelSusceptible, Highlightable, TextFlowSusceptible { }

@Component({
  selector: 'evt-named-entity-ref',
  templateUrl: './named-entity-ref.component.html',
  styleUrls: ['./named-entity-ref.component.scss'],
})
@register(NamedEntityRef)
export class NamedEntityRefComponent {
  @Input() data: NamedEntityRef;
  availableEntities$ = this.evtModelService.namedEntities$.pipe(
    map(ne => ne.all.entities.length > 0),
  );

  entity$ = this.evtModelService.namedEntities$.pipe(
    map(ne => ne.all.entities.find(e => e.id === this.data.entityId) || 'notFound'),
  );

  public highlighted$ = this.entitiesSelectService.selectedItems$.pipe(
    tap(items => {
      if (this.data) {
        this.data.class = this.data.class || '';
        this.data.attributes = this.data.attributes || {};
      }

      return items;
    }),
    map(items => items.some(i => i && this.data &&
      this.entitiesSelectService.matchClassAndAttributes(i.value, this.data.attributes, this.data.class))),
  );

  public opened = false;

  constructor(
    public evtStatusService: EVTStatusService,
    private evtModelService: EVTModelService,
    private entitiesSelectService: EntitiesSelectService,
  ) {
  }

  toggleEntityData(event: MouseEvent) {
    event.stopPropagation();
    this.opened = !this.opened;
  }
}
