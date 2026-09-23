import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { combineLatestWith, distinctUntilChanged, map, shareReplay, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  ChangeLayerData,
  EditionStructure,
  Facsimile,
  NamedEntities,
  NamedEntityOccurrence,
  OriginalEncodingNodeType,
  Page,
  Witness,
  XMLImagesValues,
  ZoneHotSpot,
  ZoneLine,
} from '../models/evt-models';
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
import { SourceEntriesParserService } from './xml-parsers/source-entries-parser.service';
import { AnalogueEntriesParserService } from './xml-parsers/analogues-entries-parser.service';
import { AppConfig, ImagesSourceNotSupported } from '../app.config';
import { BibliographicEntriesParserService } from './xml-parsers/bibliographic-entries-parser.service';
import { ModParserService } from './xml-parsers/mod-parser.service';
import { EditionSource } from './named-entities.service';
import { ViewSourceFactory } from '../models/evt-polymorphic-models';
import { N_ATTRIBUTE } from '../models/constants';

@Injectable({
  providedIn: 'root',
})
export class EVTModelService {
  public readonly editionSources$: Observable<EditionSource[]> = this.editionDataService.allEditionSources$.pipe(
    shareReplay(1),
  );
  public readonly updateEditionId$: BehaviorSubject<string> = new BehaviorSubject('');
  public readonly currentEdition$: Observable<EditionSource> = combineLatest([
    this.updateEditionId$,
    this.editionSources$
  ]).pipe(
    map(([id, sources]) => {
      return id ? sources.find(s => s.editionInfo.editionId == id) : sources[0];
    }),
    distinctUntilChanged(),
    shareReplay(1),
  );

  public readonly currentEditionData$: Observable<OriginalEncodingNodeType> = this.currentEdition$.pipe(
    map(ed => ed.editionData),
    shareReplay(1)
  );

  public readonly currentEditionTitle$ = this.currentEditionData$.pipe(
    map((source) => this.prefatoryMatterParser.parseEditionTitle(source)),
    shareReplay(1),
  );

  public readonly currentEditionProjectInfo$ = this.currentEditionData$.pipe(
    map((source) => this.prefatoryMatterParser.parseProjectInfo(source)),
    shareReplay(1),
  );

  public readonly currentEditionStyleDefaults$ = this.currentEditionProjectInfo$.pipe(
    map((projectInfo) => projectInfo?.encodingDesc?.styleDefDecl),
    shareReplay(1),
  );

  public readonly currentEditionStructure$: Observable<EditionStructure> = this.currentEditionData$.pipe(
    withLatestFrom(this.currentEdition$),
    map(([source, edition]) => {
      return {
        source: source,
        edition: this.editionStructureParser.parsePages(edition.editionSource.imagesSource, source)
      };
    }),
    map(({ source, edition }) => {
      this.editionStructureParser.processCriticalApparatus(source, edition)
      return edition;
    }),
    shareReplay(1),
  );

  public readonly pages$: Observable<Page[]> = this.currentEditionStructure$.pipe(
    map((source) => source.pages),
    shareReplay(1),
  );

  // NAMED ENTITIES
  public readonly parsedLists$ = this.editionSources$.pipe(
    map((editionSources) => this.namedEntitiesParser.parseLists(editionSources)),
    shareReplay(1),
  );

  public readonly persons$ = this.parsedLists$.pipe(
    map(({ lists, entities }) => (
      this.namedEntitiesParser.getResultsByType(
        lists, entities, AppConfig.evtSettings.edition.namedEntitiesLists.persons.namedEntityType))),
  );

  public readonly places$ = this.parsedLists$.pipe(
    map(({ lists, entities }) => this.namedEntitiesParser.getResultsByType(
      lists, entities, AppConfig.evtSettings.edition.namedEntitiesLists.places.namedEntityType)),
  );

  public readonly organizations$ = this.parsedLists$.pipe(
    map(({ lists, entities }) => this.namedEntitiesParser.getResultsByType(
      lists, entities, AppConfig.evtSettings.edition.namedEntitiesLists.organizations.namedEntityType)),
  );

  public readonly relations$ = this.parsedLists$.pipe(
    map(({ relations }) => relations),
  );

  public readonly events$ = this.parsedLists$.pipe(
    map(({ lists, entities }) => this.namedEntitiesParser.getResultsByType(
      lists, entities, AppConfig.evtSettings.edition.namedEntitiesLists.events.namedEntityType)),
  );

  public readonly entries$ = this.parsedLists$.pipe(
    map(({ lists, entities }) => this.namedEntitiesParser.getResultsByType(
      lists, entities, AppConfig.evtSettings.edition.namedEntitiesLists.entries.namedEntityType)),
  );

  public readonly objects$ = this.parsedLists$.pipe(
    map(({ lists, entities }) => this.namedEntitiesParser.getResultsByType(
      lists, entities, AppConfig.evtSettings.edition.namedEntitiesLists.objects.namedEntityType)),
  );

  public readonly verses$ = this.currentEditionData$.pipe(
    map((source) => this.linesVersesParser.parseVerses(source)),
    shareReplay(1),
  );

  public readonly lines$ = this.currentEditionData$.pipe(
    map((source) => this.linesVersesParser.parseLines(source)),
    shareReplay(1),
  );

  public readonly namedEntities$: Observable<NamedEntities> = combineLatest([
    this.persons$,
    this.places$,
    this.organizations$,
    this.relations$,
    this.events$,
    this.entries$,
    this.objects$
  ]).pipe(
    map(([persons, places, organizations, relations, events, entries, objects]) => ({
      all: {
        lists: [...persons.lists, ...places.lists, ...organizations.lists, ...events.lists, ...entries.lists, ...objects.lists],
        entities: [...persons.entities, ...places.entities, ...organizations.entities, ...events.entities, ...entries.entities, ...objects.entities],
      },
      persons,
      places,
      organizations,
      relations,
      events,
      entries,
      objects
    })),
    shareReplay(1),
  );

  public readonly noNamedEntities$: Observable<boolean> = this.namedEntities$.pipe(
    map(ne => !ne.all.entities.length),
    shareReplay(1),
  );

  public entitiesOccurrences$: Observable<Map<NamedEntityOccurrence[]>> = this.pages$.pipe(
    map((pages) => this.namedEntitiesParser.parseNamedEntitiesOccurrences(pages)),
    shareReplay(1),
  );

  public readonly witnesses$ = this.currentEditionData$.pipe(
    map((source) => this.witnessesParser.parseWitnesses(source)),
    shareReplay(1),
  );

  public readonly flattenedWitnesses$ = this.witnesses$.pipe(
    map((witnesses) => this.flattenWitnesses(witnesses)),
    shareReplay(1),
  );

  // CHANGES
  public changeData$: Observable<ChangeLayerData> = this.currentEditionData$.pipe(
    map((source) => this.modParser.buildChangeList(source)),
    shareReplay(1),
  );

  // APPARATUS ENTRIES
  public readonly appEntries$ = this.currentEditionData$.pipe(
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

  public readonly appVariance$ = this.flattenedWitnesses$.pipe(
    switchMap((witList) => this.significantReadingsNumber$.pipe(
      map((signRdgsNum) => this.apparatusParser.getAppVariance(signRdgsNum, witList)),
    )),
    shareReplay(1),
  );

  //QUOTED SOURCES
  public readonly sourceEntries$ = this.currentEditionData$.pipe(
    map((source) => this.sourceParser.parseSourceEntries(source)),
    shareReplay(1),
  );

  // PARALLEL PASSAGES
  public readonly analogueEntries$ = this.currentEditionData$.pipe(
    map((source) => this.analogueParser.parseAnaloguesEntries(source)),
    shareReplay(1),
  );

  // FACSIMILE
  public readonly facsimile$: Observable<Facsimile[]> = this.currentEditionData$.pipe(
    map((source) => this.facsimileParser.parseFacsimile(source)),
    shareReplay(1),
  );

  public readonly facsimileImageDouble$: Observable<Facsimile | undefined> = this.facsimile$.pipe(
    map((facSimiles) => {
      const fcRendDouble = facSimiles.find((fs) => fs.attributes['rend'] === 'double');
      if (fcRendDouble) { return fcRendDouble; }

      const fcWithSurfacesGrp = facSimiles.find((fs) => fs.surfaceGrps?.length > 0);
      if (fcWithSurfacesGrp) { return fcWithSurfacesGrp; }

      return undefined;
    }),
  );

  public readonly imageDoublePages$: Observable<Page[]> = this.facsimileImageDouble$.pipe(
    combineLatestWith(this.pages$),
    map(([facsSimile, pages]) => {
      if (facsSimile?.graphics?.length > 0) {
        // Qui abbiamo i graphics
        return facsSimile.graphics.map((_g, index) => {
          const p: Page = {
            url: '',
            parsedContent: undefined,
            originalContent: undefined,
            label: _g.attributes[N_ATTRIBUTE],
            id: index.toString(),
            facsUrl: '',
            facs: '',
          };

          return p;
        });
      }

      return facsSimile?.surfaceGrps.map((sGrp) => {
        const titleName = sGrp.surfaces.reduce((pv, cv) => {
          const fp: Page = pages.find((p) => p.id === cv.corresp);
          if (pv.length === 0) {

            if (fp) {
              return pv + fp.label;
            }

            return pv + cv.corresp.replace('#', '');
          }
          if (fp) {
            return pv + ' ' + fp.label;
          }

          return pv + ' ' + cv.corresp.replace('#', '');

        }, '');
        const id = sGrp.surfaces.reduce((pv, cv) => {
          if (pv.length === 0) {
            return pv + cv.corresp.replace('#', '');
          }

          return pv + '-' + cv.corresp.replace('#', '');
        }, '');

        const p: Page = {
          url: '',
          parsedContent: undefined,
          originalContent: undefined,
          label: titleName,
          id: id,
          facsUrl: '',
          facs: '',
        };

        return p;
      });


    }),
  );

  public readonly imageDouble$: Observable<{ type: string, value: { xmlImages: XMLImagesValues[] } } | undefined> =
    this.facsimileImageDouble$.pipe(
      withLatestFrom(this.currentEdition$),
      map(([fs, edition]) => {
        const imagesSource = edition.editionSource.imagesSource;
        if (imagesSource.kind !== 'EditionXml' && imagesSource.kind !== 'ExternalXml')
          throw new ImagesSourceNotSupported(imagesSource);

        const imagesFolderUrl = imagesSource.imagesFolderUrls.double;
        if (fs?.graphics?.length > 0) {
          //const editionImages = AppConfig.evtSettings.files.editionImagesSource;
          const result: XMLImagesValues[] = fs.graphics.map((g) => {

            const fileName = g.url;
            const url = `${imagesFolderUrl}${fileName}`;
            const r: XMLImagesValues = {
              url: url,
              width: g.width ? parseInt(g.width) : 910,
              height: g.height ? parseInt(g.height) : 720,
            };

            return r;
          });

          return {
            type: 'default',
            value: {
              xmlImages: result,
            },
          };
        } else if (fs?.surfaceGrps?.length > 0) {
          const result: XMLImagesValues[] = fs.surfaceGrps.map((sGrp) => {

            const fileName = sGrp.surfaces.reduce((pv, cv) => {
              if (pv.length === 0) {
                return pv + cv.corresp.replace('#', '');
              }

              return pv + '-' + cv.corresp.replace('#', '');
            }, '');

            const url = `${imagesFolderUrl}${fileName}.jpg`;
            const r: XMLImagesValues = {
              url: url,
              width: 910,
              height: 720,
            };

            return r;
          });

          return {
            type: 'default',
            value: {
              xmlImages: result,
            },
          };
        }

        return undefined;
      }),
    );

  public readonly surfaces$ = this.currentEditionData$.pipe(
    map((source) => this.facsimileParser.parseSurfaces(source)),
    shareReplay(1),
  );

  public readonly imageViewer$ = combineLatest([
    this.surfaces$,
    this.currentEdition$
  ]).pipe(
    map(([surfaces, edition]) => {
      const imagesSource = edition.editionSource.imagesSource;
      if (!imagesSource) throw new Error("Image source is required");

      return ViewSourceFactory.create(imagesSource).getDataType(surfaces);
    }),
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
  public readonly characters$ = this.currentEditionData$.pipe(
    map((source) => this.characterDeclarationsParser.parseChars(source)),
    shareReplay(1),
  );

  public readonly glyphs$ = this.currentEditionData$.pipe(
    map((source) => this.characterDeclarationsParser.parseGlyphs(source)),
    shareReplay(1),
  );

  public readonly specialChars$ = combineLatest([
    this.characters$,
    this.glyphs$,
  ]).pipe(
    map(([chars, glyphs]) => chars.concat(glyphs)),
  );

  public readonly msDesc$ = this.currentEditionData$.pipe(
    map((source) => this.msDescParser.parseMsDesc(source)),
    shareReplay(1),
  );

  public readonly bibliographicEntries$ = this.currentEditionData$.pipe(
    map((source) => this.bibliographicEntriesParser.parseBibliographicEntries(source)),
    shareReplay(1),
  )

constructor(
  private analogueParser: AnalogueEntriesParserService,
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
  private sourceParser: SourceEntriesParserService,
  private bibliographicEntriesParser: BibliographicEntriesParserService,
  private modParser: ModParserService,
) {
}

getPage(pageId: string): Observable < Page > {
  return this.pages$.pipe(map((pages) => pages.find((page) => page.id === pageId)));
}

  private flattenWitnesses(witnesses: Witness[]): Witness[] {
  return witnesses.reduce((acc, witness) => {
    acc.push(witness);
    if (witness.witnesses && Array.isArray(witness.witnesses)) {
      acc.push(...this.flattenWitnesses(witness.witnesses));
    }
    return acc;
  }, []);
}
}
