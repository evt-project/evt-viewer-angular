import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { NamedEntities, NamedEntitiesListData, PageData, Relation } from '../models/evt-models';

@Injectable({
  providedIn: 'root',
})
export class EVTModelService {
  public pages$: BehaviorSubject<PageData[]> = new BehaviorSubject([]);
  public readonly persons$: BehaviorSubject<NamedEntitiesListData> = new BehaviorSubject({
    lists: [],
    entities: [],
  });
  public readonly places$: BehaviorSubject<NamedEntitiesListData> = new BehaviorSubject({
    lists: [],
    entities: [],
  });
  public readonly organizations$: BehaviorSubject<NamedEntitiesListData> = new BehaviorSubject({
    lists: [],
    entities: [],
  });
  public readonly relations$: BehaviorSubject<Relation[]> = new BehaviorSubject([]);
  public readonly events$: BehaviorSubject<NamedEntitiesListData> = new BehaviorSubject({
    lists: [],
    entities: [],
  });
  public namedEntities$: Observable<NamedEntities> = combineLatest([
    this.persons$,
    this.places$,
    this.organizations$,
    this.relations$,
    this.events$,
  ]).pipe(
    map(([persons, places, organizations, relations, events]) => ({
      all: {
        lists: [...persons.lists, ...places.lists, ...organizations.lists, ...events.lists],
        entities: [...persons.entities, ...places.entities, ...organizations.entities, ...events.entities],
      },
      persons,
      places,
      organizations,
      relations,
      events,
    })),
    shareReplay(1),
  );

  getPages(): Observable<PageData[]> {
    return this.pages$;
  }

  getPage(pageId: string): Observable<PageData> {
    return this.pages$.pipe(map((pages) => pages.find((page) => page.id === pageId)));
  }

}
