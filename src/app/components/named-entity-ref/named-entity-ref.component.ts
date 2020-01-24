import { Component, Input } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { NamedEntityRefData } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
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
    map(ne => ne.all.entities.find(e => e.id === this.data.entityId)),
  );

  public highlighted$ = of(true); // TODO: connect to highlight service
  public opened = false;

  constructor(
    private neParserService: NamedEntitiesParserService,
  ) {
  }

  toggleEntityData(event: MouseEvent) {
    event.stopPropagation();
    this.opened = !this.opened;
  }

}
