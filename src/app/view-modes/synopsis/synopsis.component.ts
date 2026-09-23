import { Component, OnDestroy, OnInit } from '@angular/core';
import { SynopsisService } from './synopsis.service';
import { Subscription, tap } from 'rxjs';
import { EditionLevelChangedArgs, PageChangedArgs, SynopsisEdition, XmlIdChangedArgs } from './synopsis.models';
import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { ActivatedRoute } from '@angular/router';
import { Corresp } from 'src/app/models/evt-models';
import { findBy } from 'src/app/utils/dom-utils';

@Component({
  selector: 'evt-synopsis',
  templateUrl: './synopsis.component.html',
  styleUrls: ['./synopsis.component.scss']
})
export class SynopsisComponent implements OnInit, OnDestroy {
  public editions: SynopsisEdition[] = [];
  public editionsItems: SynopsisEditionItem[] = [];
  public gridsterOptions: GridsterConfig = {}; // cant be null at the start
  private editionsSubscription: Subscription;
  error: string | null;
  private readonly flashClass = "flash-highlight";

  constructor(
    private synopsisService: SynopsisService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.editionsSubscription = this.synopsisService.allEditions$.pipe(
      tap((editionSources) => {
        this.editionsItems = editionSources.map((x, i) => ({
          edition: x,
          gridsterItem: { cols: 1, rows: 1, y: 0, x: i }
        }));
        this.editions = [...this.editionsItems.map(x => x.edition)];
        this.gridsterOptions = {
          gridType: this.editionsItems.length <= 3 ? GridType.Fit : GridType.ScrollHorizontal,
          displayGrid: DisplayGrid.OnDragAndResize,
          compactType: CompactType.CompactLeft,
          scrollToNewItems: true,
          margin: 0,
          maxRows: 1,
          draggable: {
            enabled: true,
            ignoreContent: true,
            dragHandleClass: 'panel-header',
          },
          resizable: {
            enabled: false,
          },
          mobileBreakpoint: 0
        };
      })).subscribe(() => {
        const correspFromUrl = Corresp.createOrDefault(this.route.snapshot.queryParamMap.get('corresp'));
        if (correspFromUrl) {
          const edition = this.editions.find(x => x.editionInfo.editionId.toLowerCase().startsWith(correspFromUrl.editionId.toLowerCase()));
          const firstId = correspFromUrl.correspIds[0]; // for searching page, the first correspId is enough
          const page = edition.pages.find(x => !!findBy(x.originalContent, `[*|id="${firstId}"]`));
          if (!page) throw new Error(`Page for correspId ${firstId} not found`);

          this.changePage({
            editionId: edition.editionInfo.editionId,
            pageId: page.id
          });
          setTimeout(() => {
            this.changeXmlId({
              editionId: edition.editionInfo.editionId,
              xmlIds: correspFromUrl.correspIds
            });
          }, 1000);
        }
        else {
          this.changePageAndSetItsFirstXmlId({
            editionId: this.editions[0].editionInfo.editionId,
            pageId: this.editions[0].selectedPage.page.id
          });
        }
      });
  }

  changePage(args: PageChangedArgs): void {
    const edition = this.editions.find(x => x.editionInfo.editionId === args.editionId);
    const newPage = edition.pages.find(x => x.id == args.pageId);
    const newPageXmlIds = this.synopsisService.getXmlIdsWithCorrespInOtherEditions(
      this.editions.map(x => x.editionData),
      edition.editionData,
      newPage);
    edition.selectedPage.page = newPage;
    edition.selectedPage.xmlIds = newPageXmlIds;
  }

  changePageAndSetItsFirstXmlId(args: PageChangedArgs): void {
    this.changePage(args);
    const edition = this.editions.find(x => x.editionInfo.editionId === args.editionId);
    this.changeXmlId({ editionId: args.editionId, xmlIds: [edition.selectedPage.xmlIds[0]] })
  }

  changeXmlId(args: XmlIdChangedArgs): void {
    const elements = Array.from(document.getElementsByClassName(this.flashClass));
    elements.forEach(x => x.classList.remove(this.flashClass));

    const edition = this.editions.find(x => x.editionInfo.editionId === args.editionId);
    const newXmlId = edition.selectedPage.xmlIds.find(x => x === args.xmlIds[0]); // selector only support one id at a time for now
    edition.selectedPage.selectedXmlId = newXmlId;

    this.scrollIntoView(args.xmlIds);

    const otherEditions = this.editions.filter(x => x.editionInfo.editionId !== args.editionId);
    for (const otherEdition of otherEditions) {
      console.group(otherEdition.editionInfo.editionTitle)

      const newPage = this.synopsisService.getCorrespPageOrDefault(otherEdition.pages, newXmlId);
      if (!newPage) {
        console.log("No corresp page found", newXmlId);
        console.groupEnd();
        continue;
      }

      console.log("Corresp page found", newPage);

      if (newPage.id === otherEdition.selectedPage.page.id) {
        console.log("The corresp page found is the current one")
      }

      const newPageXmlIds = this.synopsisService.getXmlIdsWithCorrespInOtherEditions(this.editions.map(x => x.editionData), otherEdition.editionData, newPage);

      for (const xmlId of args.xmlIds) {
        const element = this.synopsisService.getPageElementByAttributeOrDefault(newPage, { key: "corresp", value: xmlId });
        const elementXmlId = element?.getAttribute("xml:id");
        console.log("Element found is", element, newXmlId, elementXmlId);
        
        this.scrollIntoView([elementXmlId]);
      }
      
      const element = this.synopsisService.getPageElementByAttributeOrDefault(newPage, { key: "corresp", value: newXmlId });
      const elementXmlId = element?.getAttribute("xml:id");
      if (!newPageXmlIds.length && elementXmlId) {
        newPageXmlIds.push(elementXmlId)
      }

      otherEdition.selectedPage.page = newPage;
      otherEdition.selectedPage.xmlIds = newPageXmlIds;
      otherEdition.selectedPage.selectedXmlId = elementXmlId;
      otherEdition.selectedPage.pageSelectionList.selectedPage = {
        pageId: newPage.id,
        pageLabel: newPage.label,
      }

      console.groupEnd();
    }
  }

  private scrollIntoView(xmlIds: string[]) {
    const tryFind = () => {
      for (const xmlId of xmlIds) {
        const el = document.querySelector(`[data-id='${xmlId}']`) as HTMLElement;
        if (!el) {
          requestAnimationFrame(tryFind); // try again next frame
        } else {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            el.classList.add(this.flashClass);
          }, 500);
        }
      }
    };
    requestAnimationFrame(tryFind);
  }

  changeEditionLevel(args: EditionLevelChangedArgs) {
    const edition = this.editions.find(x => x.editionInfo.editionId === args.editionId);
    edition.editionLevel = args.editionLevel;
  }

  getGridsterItemForIndex(index: number) {
    return { cols: 1, rows: 1, y: 0, x: index }
  }

  ngOnDestroy(): void {
    this.editionsSubscription.unsubscribe();
  }
}

export interface SynopsisEditionItem {
  edition: SynopsisEdition;
  gridsterItem: GridsterItem;
}