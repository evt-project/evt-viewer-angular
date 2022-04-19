import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { NamedEntities, NamedEntityOccurrence, OriginalEncodingNodeType, Page, ZoneHotSpot, ZoneLine } from '../models/evt-models';
import { Map } from '../utils/js-utils';
import { EditionDataService } from './edition-data.service';
import { ApparatusEntriesParserService } from './xml-parsers/apparatus-entries-parser.service';
import { CharacterDeclarationsParserService } from './xml-parsers/character-declarations-parser.service';
import { FacsimileParserService } from './xml-parsers/facsimile-parser.service';
import { LinesVersesParserService } from './xml-parsers/lines-verses-parser.service';
import { MsDescParserService } from './xml-parsers/ms-desc-parser.service';
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

  public readonly projectInfo$ = this.prefatoryMatterParser.projectInfo$.pipe(
    shareReplay(1),
  );

  public readonly pages$: Observable<Page[]> = this.editionSource$.pipe(
    map((source) => this.editionStructureParser.parsePages(source).pages),
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

  public readonly verses$ = this.editionSource$.pipe(
    map((source) => this.linesVersesParser.parseVerses(source)),
    shareReplay(1),
  );

  public readonly lines$ = this.editionSource$.pipe(
    map((source) => this.linesVersesParser.parseLines(source)),
    shareReplay(1),
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
    map(({ witnesses }) => witnesses),
    shareReplay(1),
  );

  public readonly groups$ = this.witnessesData$.pipe(
    map(({ groups }) => groups),
    shareReplay(1),
  );

  // APPARATUS ENTRIES
  public readonly appEntries$ = this.editionSource$.pipe(
    map((source) => this.apparatusParser.parseAppEntries(source)),
    shareReplay(1),
  );

  public readonly significantReadings$ = this.appEntries$.pipe(
    map((appEntries) => this.apparatusParser.getSignificantReadings(appEntries)),
    shareReplay(1),
  );

  public readonly significantReadingsNumber$ = this.significantReadings$.pipe(
    map((signRdgs) => this.apparatusParser.getSignificantReadingsNumber(signRdgs)),
    shareReplay(1),
  );

  public readonly appVariance$ = this.witnesses$.pipe(
    switchMap((witList) => {
      return this.significantReadingsNumber$.pipe(
        map((signRdgsNum) => this.apparatusParser.getAppVariance(signRdgsNum, witList)),
      );
    }),
    shareReplay(1),
  );

  // FACSIMILE
  public readonly surfaces$ = this.editionSource$.pipe(
    map((source) => this.facsimileParser.parseSurfaces(source)),
    shareReplay(1),
  );

  public readonly hsLines$ = this.surfaces$.pipe(
    map((surfaces) => surfaces.reduce((x: ZoneLine[], y) => x.concat(y.zones.lines), [])),
    shareReplay(1),
  );

  public readonly hotspots$ = this.surfaces$.pipe(
    map((surfaces) => surfaces.reduce((x: ZoneHotSpot[], y) => x.concat(y.zones.hotspots), [])),
    shareReplay(1),
  );

  // CHAR DECL
  public readonly characters$ = this.editionSource$.pipe(
    map((source) => this.characterDeclarationsParser.parseChars(source)),
    shareReplay(1),
  );

  public readonly glyphs$ = this.editionSource$.pipe(
    map((source) => this.characterDeclarationsParser.parseGlyphs(source)),
    shareReplay(1),
  );

  public readonly specialChars$ = combineLatest([
    this.characters$,
    this.glyphs$,
  ]).pipe(
    map(([chars, glyphs]) => chars.concat(glyphs)),
  );

  public readonly msDesc$ = this.editionSource$.pipe(
    map((source) => this.msDescParser.parseMsDesc(source)),
    shareReplay(1),
);

  constructor(
    private editionDataService: EditionDataService,
    private editionStructureParser: StructureXmlParserService,
    private namedEntitiesParser: NamedEntitiesParserService,
    private prefatoryMatterParser: PrefatoryMatterParserService,
    private witnessesParser: WitnessesParserService,
    private apparatusParser: ApparatusEntriesParserService,
    private facsimileParser: FacsimileParserService,
    private characterDeclarationsParser: CharacterDeclarationsParserService,
    private linesVersesParser: LinesVersesParserService,
    private msDescParser: MsDescParserService,
  ) {
  }

  getPage(pageId: string): Observable<Page> {
    return this.pages$.pipe(map((pages) => pages.find((page) => page.id === pageId)));
  }
}
