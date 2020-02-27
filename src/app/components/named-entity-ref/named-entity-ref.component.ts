import { Component, Input } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { HighlightableComponent } from '../../highlightable/highlightable.component';
import { NamedEntityRefData } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EntitiesSelectService } from '../../services/entities-select.service';
import { NamedEntitiesParserService } from '../../services/xml-parsers/named-entities-parser.service';

@Component({
  selector: 'evt-named-entity-ref',
  templateUrl: './named-entity-ref.component.html',
  styleUrls: ['./named-entity-ref.component.scss'],
})
@register
export class NamedEntityRefComponent extends HighlightableComponent {
  @Input() data: NamedEntityRefData;

  entity$ = this.neParserService.namedEntities$.pipe(
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
    private neParserService: NamedEntitiesParserService,
    private entitiesSelectService: EntitiesSelectService,
  ) {
    super();
  }

  toggleEntityData(event: MouseEvent) {
    event.stopPropagation();
    this.opened = !this.opened;
  }
}
