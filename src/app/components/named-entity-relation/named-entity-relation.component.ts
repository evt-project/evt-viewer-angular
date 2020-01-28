import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NamedEntity, Relation } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { NamedEntitiesParserService } from '../../services/xml-parsers/named-entities-parser.service';

@register
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
    private neParserService: NamedEntitiesParserService,
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
    Observable<Array<{ id: string; entity: NamedEntity }>> {
    return this.neParserService.namedEntities$.pipe(
      map(ne => this.data[partIdsGroup].map(entityId => ({
        id: entityId,
        entity: ne.all.entities.find(e => e.id === entityId),
      }))),
      map(nes => nes.filter(e => !!e)),
    );
  }
}
