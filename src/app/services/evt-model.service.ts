import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { NamedEntities, NamedEntityOccurrence, OriginalEncodingNodeType, Page } from '../models/evt-models';
import { Map } from '../utils/js-utils';
import { EditionDataService } from './edition-data.service';
import { ApparatusEntriesParserService } from './xml-parsers/apparatus-entries-parser.service';
import { NamedEntitiesParserService } from './xml-parsers/named-entities-parser.service';
import { PrefatoryMatterParserService } from './xml-parsers/prefatory-matter-parser.service';
import { StructureXmlParserService } from './xml-parsers/structure-xml-parser.service';
import { WitnessesParserService } from './xml-parsers/witnesses-parser.service';

@Injectable({
  providedIn: 'root',
})
export class EVTModelService {
  public readonly editionSource$: Observable<OriginalEncodingNodeType> = this.editionDataService.parsedEditionSource$
    .pipe(
      shareReplay(1),
    );

  public readonly title$ = this.editionSource$.pipe(
    map((source) => this.prefatoryMatterParser.parseEditionTitle(source)),
    shareReplay(1),
  );

  public readonly pages$: Observable<Page[]> = this.editionSource$.pipe(
    map((source) => this.editionStructureParser.parsePages(source)),
    map(editionStructure => editionStructure.pagesIndexes.map(pageId => editionStructure.pages[pageId])),
    shareReplay(1),
  );

  // NAMED ENTITIES
  public readonly parsedLists$ = this.editionSource$.pipe(
    map((source) => this.namedEntitiesParser.parseLists(source)),
    shareReplay(1),
  );

  public readonly persons$ = this.parsedLists$.pipe(
    map(({ lists, entities }) => (this.namedEntitiesParser.getResultsByType(lists, entities, ['person', 'personGrp']))),
  );

  public readonly places$ = this.parsedLists$.pipe(
    map(({ lists, entities }) => this.namedEntitiesParser.getResultsByType(lists, entities, ['place'])),
  );

  public readonly organizations$ = this.parsedLists$.pipe(
    map(({ lists, entities }) => this.namedEntitiesParser.getResultsByType(lists, entities, ['org'])),
  );

  public readonly relations$ = this.parsedLists$.pipe(
    map(({ relations }) => relations),
  );

  public readonly events$ = this.parsedLists$.pipe(
    map(({ lists, entities }) => this.namedEntitiesParser.getResultsByType(lists, entities, ['event'])),
  );

  public readonly namedEntities$: Observable<NamedEntities> = combineLatest([
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

  public entitiesOccurrences$: Observable<Map<NamedEntityOccurrence[]>> = this.pages$.pipe(
    map((pages) => this.namedEntitiesParser.parseNamedEntitiesOccurrences(pages)),
    shareReplay(1),
  );

  // WITNESSES
  public readonly witnessesData$ = this.editionSource$.pipe(
    map((source) => this.witnessesParser.parseWitnessesData(source)),
    shareReplay(1),
  );

  public readonly witnesses$ = this.witnessesData$.pipe(
    map(({witnesses}) => witnesses),
    shareReplay(1),
  );

  // APPARATUS ENTRIES
  public readonly appEntries$ = this.editionSource$.pipe(
    map((source) => this.apparatusParser.parseAppEntries(source)),
    shareReplay(1),
  );

  constructor(
    private editionDataService: EditionDataService,
    private editionStructureParser: StructureXmlParserService,
    private namedEntitiesParser: NamedEntitiesParserService,
    private prefatoryMatterParser: PrefatoryMatterParserService,
    private witnessesParser: WitnessesParserService,
    private apparatusParser: ApparatusEntriesParserService,
  ) {
  }

  getPage(pageId: string): Observable<Page> {
    return this.pages$.pipe(map((pages) => pages.find((page) => page.id === pageId)));
  }
}
