import { Component, ElementRef, Input, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import { delay, distinctUntilChanged, filter, map, shareReplay, tap, withLatestFrom } from 'rxjs/operators';
import { AppConfig, EditionLevel, EditionLevelType, HideDeletions, TextFlow } from '../../app.config';
import { EntitiesSelectItem } from '../../components/entities-select/entities-select.component';
import { Page } from '../../models/evt-models';
import { EVTModelService } from '../../services/evt-model.service';
import { EVTStatusService } from '../../services/evt-status.service';
import { EvtIconInfo } from '../../ui-components/icon/icon.component';

@Component({
  selector: 'evt-text-panel',
  templateUrl: './text-panel.component.html',
  styleUrls: ['./text-panel.component.scss'],
})
export class TextPanelComponent {
  // tslint:disable-next-line: variable-name
  private _mc: ElementRef;
  @ViewChild('mainContent')
  set mainContent(el: ElementRef) {
    this._mc = el;
    if (this.pageID) {
      this._scrollToPage(this.pageID);
    }
  }
  get mainContent() {
    return this._mc;
  }

  public selLayer;
  @Input() set selectedLayer(layer: string) {
    this.selLayer = layer;
    this.evtStatus.updateLayer$.next(layer);
  }
  get selectedLayer() { return this.selLayer; }

  @Input() hideEditionLevelSelector: boolean;

  @Input() showChangeLayerSelector: boolean;

  @Input() enableHideDeletionsToggler: boolean;

  @Input() pageID: string;
  updatePageFromScroll$ = new BehaviorSubject<void>(undefined);
  updatePage$ = new BehaviorSubject<Page>(undefined);

  public currentPage$ = merge(
    this.updatePageFromScroll$.pipe(
      withLatestFrom(this.evtModelService.pages$, this.evtStatus.currentPage$),
      map(([, pages, currentPage]) => {
        if (this.mainContent && this.editionLevelID === 'critical') {
          const mainContentEl: HTMLElement = this.mainContent.nativeElement;
          const pbs = mainContentEl.querySelectorAll('evt-page');
          let pbCount = 0;
          let pbVisible = false;
          let pbId = '';
          const docViewTop = mainContentEl.scrollTop;
          const docViewBottom = docViewTop + mainContentEl.parentElement.clientHeight;
          while (pbCount < pbs.length && !pbVisible) {
            pbId = pbs[pbCount].getAttribute('data-id');
            const pbElem = mainContentEl.querySelector<HTMLElement>(`evt-page[data-id="${pbId}"]`);
            const pbRect = pbElem.getBoundingClientRect();
            if (pbRect.top && (pbRect.top <= docViewBottom) && (pbRect.top >= docViewTop)) {
              pbVisible = true;
            } else {
              pbCount++;
            }
          }
          if (pbVisible && currentPage?.id !== pbId) {
            this.updatingPageFromScroll = true;
            currentPage = pages.find((p) => p.id === pbId);
          }
        }

        return currentPage;
      }),
    ),
    this.updatePage$,
  ).pipe(
    distinctUntilChanged((x, y) => x?.id === y?.id),
  );
  public currentPageId$ = this.currentPage$.pipe(
    map((p) => p?.id),
  );
  @Output() pageChange: Observable<Page> = this.currentPage$.pipe(
    filter((p) => !!p),
    tap((page) => this._scrollToPage(page?.id)),
  );

  // tslint:disable-next-line: variable-name
  private _edLevel: EditionLevelType;
  @Input() public set editionLevelID(e: EditionLevelType) {
    this._edLevel = e;
    if (e && !this.textFlow) {
      this.textFlow = this.defaultTextFlow;
    }
  }
  public get editionLevelID() {
    return this._edLevel;
  }

  public currentEdLevel$ = new BehaviorSubject<EditionLevel>(undefined);
  public currentEdLevelId$ = this.currentEdLevel$.pipe(
    map((e) => e?.id),
  );
  @Output() editionLevelChange: Observable<EditionLevel> = this.currentEdLevel$.pipe(
    filter((e) => !!e),
    distinctUntilChanged(),
  );

  public currentStatus$ = combineLatest([
    this.evtModelService.pages$,
    this.currentPage$,
    this.currentEdLevel$,
    this.evtStatus.currentViewMode$,
  ]).pipe(
    delay(0),
    filter(([pages, currentPage, editionLevel, currentViewMode]) => !!pages && !!currentPage && !!editionLevel && !!currentViewMode),
    map(([pages, currentPage, editionLevel, currentViewMode]) => ({ pages, currentPage, editionLevel, currentViewMode })),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    shareReplay(1),
  );

  public itemsToHighlight$ = new Subject<EntitiesSelectItem[]>();
  public secondaryContent = '';
  private showSecondaryContent = false;

  public enableProseVersesToggler = AppConfig.evtSettings.edition.proseVersesToggler;
  get defaultTextFlow() {
    if (!this.enableProseVersesToggler) {
      return undefined;
    }
    if (this.editionLevelID === 'critical') {
      return AppConfig.evtSettings.edition.defaultTextFlow || 'verses';
    }

    return AppConfig.evtSettings.edition.defaultTextFlow || 'prose';
  }
  // tslint:disable-next-line: variable-name
  private _tf: TextFlow;
  public set textFlow(tf: TextFlow) {
    this._tf = tf;
  }
  public get textFlow() {
    return this._tf;
  }

  private _dl: HideDeletions = 'show deletions';
  public set deletions(dl: HideDeletions) {
    this._dl = dl;
  }
  public get deletions() {
    return this._dl;
  }

  public get proseVersesTogglerIcon(): EvtIconInfo {

    return { icon: this.textFlow === 'prose' ? 'align-left' : 'align-justify', iconSet: 'fas' };
  }

  public get hideDeletionsTogglerIcon(): EvtIconInfo {
    return { icon: (this.deletions === 'show deletions') ? 'eye' : 'eye-slash', iconSet: 'fas' };
  }

  public isMultiplePageFlow$ = this.currentStatus$.pipe(
    map((x) => x.editionLevel.id === 'critical' && x.currentViewMode.id !== 'imageText'),
    shareReplay(1),
  );

  private updatingPageFromScroll = false;

  constructor(
    public evtModelService: EVTModelService,
    public evtStatus: EVTStatusService,
  ) {
  }

  getSecondaryContent(): string {
    return this.secondaryContent;
  }

  isSecondaryContentOpened(): boolean {
    return this.showSecondaryContent;
  }

  toggleSecondaryContent(newContent: string) {
    if (this.secondaryContent !== newContent) {
      this.showSecondaryContent = true;
      this.secondaryContent = newContent;
    }
    else {
      this.showSecondaryContent = false;
      this.secondaryContent = '';
    }
  }

  toggleProseVerses() {
    this.textFlow = this.textFlow === 'prose' ? 'verses' : 'prose';
  }

  toggleHideDeletions() {
    this.deletions = (this.deletions === 'show deletions') ? 'hide deletions' : 'show deletions'
  }

  updateSelectedLayer(layer) {
    this.selectedLayer = layer;
  }

  private _scrollToPage(pageId: string) {
    if (this.updatingPageFromScroll) {
      this.updatingPageFromScroll = false;
    } else if (this.mainContent) {
      const mainContentEl: HTMLElement = this.mainContent.nativeElement;
      const pageEl = mainContentEl.querySelector<HTMLElement>(`[data-id="${pageId}"]`);
      if (pageEl) {
        pageEl.scrollIntoView();
      } else {
        mainContentEl.parentElement.scrollTop = 0;
      }
    }
  }
}
