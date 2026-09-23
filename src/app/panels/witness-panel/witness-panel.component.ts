import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map, Observable, shareReplay, withLatestFrom } from 'rxjs';
import { ApparatusEntry, Attribute, GenericElement, Page } from 'src/app/models/evt-models';
import { EVTModelService } from 'src/app/services/evt-model.service';
import { StructureXmlParserService } from 'src/app/services/xml-parsers/structure-xml-parser.service';
import { WitnessItem } from 'src/app/view-modes/collation/collation.component';
import { WitnessPanelService } from './witness-panel.service';
import { AppParser } from 'src/app/services/xml-parsers/app-parser';
import { isElementBetween } from 'src/app/utils/dom-utils';
import { AppConfig, ImagesSource } from 'src/app/app.config';
import { GenericParserService } from 'src/app/services/xml-parsers/generic-parser.service';

@Component({
  selector: 'evt-witness-panel',
  templateUrl: './witness-panel.component.html',
  styleUrls: ['./witness-panel.component.scss'],
  providers: [WitnessPanelService]
})
export class WitnessPanelComponent implements OnInit {
  @Input() witnessItem: WitnessItem;
  @Output() hide = new EventEmitter<boolean>();
  @Output() changePage = new EventEmitter<string>();

  private appParser = AppParser.create();

  pages$: Observable<Page[]> = this.evtModelService.currentEditionData$.pipe(
    withLatestFrom(this.evtModelService.currentEdition$),
    map(([source, edition]) => this.processSource(edition.editionSource.imagesSource, source)),
    shareReplay(1)
  );

  currentPage$: Observable<Page> = this.pages$.pipe(
    map(pages => pages.find(p => p.id === this.witnessItem.currentPageId)),
  );

  private readonly appExponentsArray = Array.from(this.structureParser.appExponents.values());

  constructor(
    private evtModelService: EVTModelService,
    private structureParser: StructureXmlParserService,
    private witnessPanelService: WitnessPanelService,
    private genericParseService: GenericParserService
  ) {
  }

  ngOnInit(): void {
    this.witnessPanelService.witnessId = this.witnessItem.id;
    this.witnessPanelService.anchestorsIds = this.witnessItem.anchestorsIds;
  }

  private processSource(imagesSource: ImagesSource, source: HTMLElement): Page[] {
    const originalPages = this.structureParser.parsePages(imagesSource, source).pages;
    const lacunaPairs = this.structureParser.groupedByWitLacunas.get(this.witnessItem.id);
    const separator = AppConfig.evtSettings.edition.structureSeparators;
    const el = document.createElement('w');
    el.innerText = ' ';
    const emptyElement = this.genericParseService.parse(el);

    function removeElementsBetweenLacunas(content: any[], onPagePartOfLacuna: () => {}, memo = []): void {
      for (let i = 0; i < content.length; i++) {
        const item = content[i] as any;
        const elementId = item.attributes?.['id'];
        const htmlElement = elementId ? source.querySelector(`[*|id='${elementId}']`) as HTMLElement | null : null;

        for (const pair of lacunaPairs) {
          if (htmlElement && pair?.start && pair?.end) {
            if (isElementBetween(pair.start, htmlElement, pair.end)) {
              const isPage = separator.includes(htmlElement.tagName);
              if (isPage) {
                onPagePartOfLacuna();
              }
              else {
                content.splice(i, 1, emptyElement);
              }
            }
          }
        }

        if (item.content) {
          removeElementsBetweenLacunas(item.content, onPagePartOfLacuna, memo);
        }
      }
    }

    if (lacunaPairs) {
      for (const page of originalPages) {
        removeElementsBetweenLacunas(page.parsedContent, () => page.isPartOfLacuna = true);
      }
    }

    const appsData: AppData[] = this.structureParser.allApps
      .map(app => {
        const parsedApp = this.appParser.parse(app) as ApparatusEntry; AppParser
        const currentAppExponent = this.getExponent(parsedApp);
        parsedApp.exponent = currentAppExponent?.label;

        const isDepa = parsedApp.isDepa();
        if (!isDepa) {
          return { app: parsedApp, from: null, to: null };
        }

        const from = Attribute.createFromOrDefault(app);
        if (!from) {
          console.error("From attribute is required", app);
          throw new Error("From attribute is required");
        }
        const to = Attribute.createToOrDefault(app);
        return { app: parsedApp, from, to };
      });

    for (const page of originalPages) {
      this.processContent(page.parsedContent as GenericElement[], appsData);
    }

    return originalPages;
  }

  private processContent(parsedContent: GenericElement[], appsData: AppData[]) {
    for (let i = 0; i < parsedContent.length; i++) {
      const element = parsedContent[i] as GenericElement;
      if (Array.isArray(element.content)) {
        this.processContent(element.content as GenericElement[], appsData);
      }

      if (element instanceof ApparatusEntry) {
        const currentAppExponent = this.getExponent(element)
        element.exponent = currentAppExponent?.label;
      }

      const depaApps = appsData.filter(appData => {
        const result = this.doesDepaAppMatchElement(appData, element);
        return result;
      });

      for (const { app, from, to, } of depaApps) {
        const fromResult = this.findElementIndexOrDefault(parsedContent, from.valueWithoutRef);
        if (!fromResult) continue;

        const { index: fromIndex, parent: fromParent } = fromResult;

        let toResult = { index: fromIndex, parent: fromParent };
        if (to) {
          const foundElement = this.findElementIndexOrDefault(parsedContent, to.valueWithoutRef);
          toResult = foundElement ?? toResult;
        }

        const { index: toIndex, parent: toParent } = toResult;
        if (fromParent === toParent) {
          const deleteCount = Math.abs(toIndex - fromIndex) + 1;
          fromParent.splice(fromIndex, deleteCount, app);
        } else {
          console.error("from and to elements are in different parent nodes. Cannot splice.");
        }
      }
    }
  }

  private getExponent(element: ApparatusEntry) {
    return this.appExponentsArray.find(exponent => {
      const areEqual = exponent.appEntry.originalEncoding.outerHTML === element.originalEncoding.outerHTML;
      return areEqual;
    });
  }

  /**
   * Check if the app matches the element, return false for inline apps.
   * @param appData 
   * @param element 
   * @returns 
   */
  private doesDepaAppMatchElement(appData: AppData, element: GenericElement) {
    const { app, from, to } = appData;
    const hasAnyReading = app.orderedReadings
      .some(r => r.witIDs.includes(this.witnessItem.id) || r.witIDs.some(x => this.witnessItem.anchestorsIds.includes(x)));

    if (!hasAnyReading || !app.isDepa()) return false;

    const elementId = element.attributes['id'];
    if (elementId) {
      const isFrom = elementId === from.valueWithoutRef;
      const isTo = elementId === to?.valueWithoutRef;
      if (isFrom || isTo) {
        return true;
      }
    }

    const fromEl = this.findElementByAttributeOrDefault(element, { name: 'id', value: from.valueWithoutRef });
    const toEl = to ? this.findElementByAttributeOrDefault(element, { name: 'id', value: to.valueWithoutRef }) : null;
    return fromEl || toEl;
  }

  private findElementIndexOrDefault(content: GenericElement[], targetId: string, currentIndex = 0) {
    for (let i = 0; i < content.length; i++) {
      const element = content[i];
      const id = element.attributes['id'];
      if (id === targetId) {
        return { index: currentIndex + i, parent: content };
      }

      if (element.content && element.content.length > 0) {
        const result = this.findElementIndexOrDefault(element.content as GenericElement[], targetId, currentIndex);
        if (result) return result;
      }
    }

    return null;
  }

  private findElementByAttributeOrDefault(element: GenericElement, target: { name: string, value: string }): GenericElement {
    const result = element.attributes[target.name];
    if (result && result === target.value) return element;
    if ((Symbol.iterator in Object(element.content)) === false) return null;

    for (const child of element.content) {
      const result = this.findElementByAttributeOrDefault(child as GenericElement, target);
      if (result) return result;
    }

    return null;
  }

  onHide() {
    this.hide.emit(true);
  }

  onChangePage(pageId: string) {
    this.changePage.emit(pageId);
  }
}

export interface AppData {
  app: ApparatusEntry;
  from: Attribute;
  to: Attribute;
}