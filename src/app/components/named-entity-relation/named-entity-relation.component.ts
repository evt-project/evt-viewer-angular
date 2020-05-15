import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NamedEntity, Relation } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EVTModelService } from '../../services/evt-model.service';

@register(Relation)
@Component({
  selector: 'evt-named-entity-relation',
  templateUrl: './named-entity-relation.component.html',
  styleUrls: ['./named-entity-relation.component.scss'],
})
export class NamedEntityRelationComponent {
  @Input() data: Relation;
  @Input() inEntity: boolean;

  selectedEntity: NamedEntity;

  activeParts$ = this.getEntities('activeParts');
  mutualParts$ = this.getEntities('mutualParts');
  passiveParts$ = this.getEntities('passiveParts');

  constructor(
    private evtModelService: EVTModelService,
  ) {
  }

  toggleEntity(entity: NamedEntity) {
    // TODO: if inEntity, then open entity in list
    if (!this.inEntity) {
      if (this.selectedEntity === entity) {
        this.selectedEntity = undefined;
      } else {
        this.selectedEntity = entity;
      }
    }
  }

  private getEntities(partIdsGroup: 'activeParts' | 'mutualParts' | 'passiveParts'):
    Observable<Array<{ id: string; entity: NamedEntity; label: string }>> {
    return this.evtModelService.namedEntities$.pipe(
      map(ne => this.data[partIdsGroup].map(entityId => {
        const entity = ne.all.entities.find(e => e.id === entityId);

        return {
          id: entityId,
          entity,
          get label() {
            return (entity ? entity.label : entityId);
          },
        };
      })),
      map(nes => nes.filter(e => !!e)),
    );
  }
}
