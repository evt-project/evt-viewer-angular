import { Component, Input } from '@angular/core';
import { map } from 'rxjs/operators';
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
export class NamedEntityRefComponent {
  @Input() data: NamedEntityRefData;

  entity$ = this.neParserService.namedEntities$.pipe(
    map(ne => ne.all.entities.find(e => e.id === this.data.entityId) || 'notFound'),
  );

  public highlighted$ = this.entitiesSelectService.selectedItems$.pipe(
    map(items => items.some(i => i && this.matchEntitySelection(i.value))),
  );
  public opened = false;

  constructor(
    private neParserService: NamedEntitiesParserService,
    private entitiesSelectService: EntitiesSelectService,
  ) {
  }

  toggleEntityData(event: MouseEvent) {
    event.stopPropagation();
    this.opened = !this.opened;
  }

  private matchEntitySelection(selectedValue) {
    return this.data.class.indexOf(selectedValue.toLowerCase()) >= 0;
  }
}
