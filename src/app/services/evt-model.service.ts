import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { combineLatestWith, map, shareReplay, switchMap } from 'rxjs/operators';
import {
  Facsimile,
  NamedEntities,
  NamedEntityOccurrence,
  OriginalEncodingNodeType,
  Page, XMLImagesValues,
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
import { AppConfig } from '../app.config';

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

  public readonly styleDefaults$ = this.prefatoryMatterParser.projectInfo$.pipe(
    map((projectInfo) => projectInfo?.encodingDesc?.styleDefDecl),
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
    switchMap((witList) => this.significantReadingsNumber$.pipe(
        map((signRdgsNum) => this.apparatusParser.getAppVariance(signRdgsNum, witList)),
      )),
    shareReplay(1),
  );

  //QUOTED SOURCES
  public readonly sourceEntries$ = this.editionSource$.pipe(
    map((source) => this.sourceParser.parseSourceEntries(source)),
    shareReplay(1),
  );

  // PARALLEL PASSAGES
  public readonly analogueEntries$ = this.editionSource$.pipe(
    map((source) => this.analogueParser.parseAnaloguesEntries(source)),
    shareReplay(1),
  );

  // FACSIMILE
  public readonly facsimile$ : Observable<Facsimile[]> = this.editionSource$.pipe(
      map((source) => this.facsimileParser.parseFacsimile(source)),
      shareReplay(1),
  );

  public readonly facsimileImageDouble$: Observable<Facsimile | undefined> = this.facsimile$.pipe(
      map((facSimiles)=>{
        const fcRendDouble = facSimiles.find((fs) => fs.attributes['rend'] === 'double');
        if (fcRendDouble) {return fcRendDouble;}

        const fcWithSurfacesGrp = facSimiles.find((fs)=> fs.surfaceGrps?.length > 0);
        if (fcWithSurfacesGrp) {return fcWithSurfacesGrp;}

        return undefined;
      }),
  );

  public readonly imageDoublePages$: Observable<Page[]> = this.facsimileImageDouble$.pipe(
      combineLatestWith(this.pages$),
      map(([ facsSimile, pages])=>{
        if (facsSimile?.graphics?.length > 0){
          // Qui abbiamo i graphics
          return facsSimile.graphics.map((_g, index)=>{
            const p : Page={
              url: '',
              parsedContent: undefined,
              originalContent: undefined,
              label: _g.attributes['n'],
              id: index.toString(),
              facsUrl: '',
              facs: '',
            };

            return p;
          });
        }

        return facsSimile?.surfaceGrps.map((sGrp)=> {
          const titleName = sGrp.surfaces.reduce((pv, cv) => {
            const fp: Page = pages.find((p)=>p.id === cv.corresp);
            if (pv.length === 0) {

              if (fp){
                return pv + fp.label;
              }

              return pv + cv.corresp.replace('#', '');
            }
            if (fp){
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

          const p : Page={
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

  public readonly imageDouble$: Observable<{ type: string, value:{ xmlImages:XMLImagesValues[]}} | undefined > =
      this.facsimileImageDouble$.pipe(
        map((fs)=> {
            if (fs?.graphics?.length > 0){
              //const editionImages = AppConfig.evtSettings.files.editionImagesSource;
              const result: XMLImagesValues[] = fs.graphics.map((g) => {

                const fileName = g.url;

                const imagesFolderUrl = AppConfig.evtSettings.files.imagesFolderUrls.double;
                const url = `${imagesFolderUrl}${fileName}`;
                const r: XMLImagesValues = {
                  url: url,
                  width: g.width?parseInt(g.width) : 910,
                  height: g.height?parseInt(g.height) : 720,
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
          const editionImages = AppConfig.evtSettings.files.editionImagesSource;
          console.log(editionImages);

          const result: XMLImagesValues[] = fs.surfaceGrps.map((sGrp) => {

            const fileName = sGrp.surfaces.reduce((pv, cv) => {
              if (pv.length === 0) {
                return pv + cv.corresp.replace('#', '');
              }

return pv + '-' + cv.corresp.replace('#', '');

            }, '');

            const imagesFolderUrl = AppConfig.evtSettings.files.imagesFolderUrls.double;
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
  ) {
  }

  getPage(pageId: string): Observable<Page> {
    return this.pages$.pipe(map((pages) => pages.find((page) => page.id === pageId)));
  }
}
