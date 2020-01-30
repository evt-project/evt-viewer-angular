import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Map } from 'src/app/utils/js-utils';
import { NamedEntitiesList, Relation } from '../../models/evt-models';
import { NamedEntitiesParserService } from '../../services/xml-parsers/named-entities-parser.service';

interface GlobalList extends NamedEntitiesList {
  icon: string;
}

@Component({
  selector: 'evt-global-lists',
  templateUrl: './global-lists.component.html',
  styleUrls: ['./global-lists.component.scss'],
})
export class GlobalListsComponent {
  lists$: Observable<GlobalList[]> = this.neParserService.namedEntities$.pipe(
    map(ne => (ne.persons.lists.concat(ne.places.lists, ne.organizations.lists, ne.events.lists))),
    map(lists => (lists.map(list => ({
      ...list,
      icon: this.listsIcons[list.namedEntityType] || 'list',
    })))),
    tap(lists => {
      if (!this.selectedList && lists[0]) {
        this.openList(undefined, lists[0]);
      }
    }),
  );
  selectedList: NamedEntitiesList;

  relations$: Observable<Relation[]> = this.neParserService.namedEntities$.pipe(
    map(ne => ne.relations),
  );

  showRelations = false;

  private listsIcons: Map<string> = {
    person: 'user',
    place: 'map-marker',
    org: 'users',
    event: 'calendar',
  };

  constructor(
    private neParserService: NamedEntitiesParserService,
  ) {
  }

  openList(event: MouseEvent, list: NamedEntitiesList) {
    if (event) {
      event.stopPropagation();
    }
    if (this.selectedList !== list) {
      this.selectedList = list;
    }
    this.showRelations = false;
  }

  openRelations() {
    this.showRelations = true;
    this.selectedList = undefined;
  }
}
