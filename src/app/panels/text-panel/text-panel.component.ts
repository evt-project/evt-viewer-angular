import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { delay, distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';
import { EVTStatusService } from 'src/app/services/evt-status.service';
import { AppConfig, EditionLevel, EditionLevelType, TextFlow } from '../../app.config';
import { EntitiesSelectItem } from '../../components/entities-select/entities-select.component';
import { Page } from '../../models/evt-models';
import { EVTModelService } from '../../services/evt-model.service';
import { EvtIconInfo } from '../../ui-components/icon/icon.component';

@Component({
  selector: 'evt-text-panel',
  templateUrl: './text-panel.component.html',
  styleUrls: ['./text-panel.component.scss'],
})
export class TextPanelComponent implements OnInit, OnDestroy {
  @Input() hideEditionLevelSelector: boolean;
  @Input() editionLevelID: EditionLevelType;
  @Input() pageID: string;
  public currentPage$ = new BehaviorSubject<Page>(undefined);
  public currentPageId$ = this.currentPage$.pipe(
    map(p => p?.id),
  );
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Output() pageChange: Observable<Page> = this.currentPage$.pipe(
    filter(p => !!p),
    distinctUntilChanged(),
  );

  public currentEdLevel$ = new BehaviorSubject<EditionLevel>(undefined);
  public currentEdLevelId$ = this.currentEdLevel$.pipe(
    map(e => e?.id),
  );
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Output() editionLevelChange: Observable<EditionLevel> = this.currentEdLevel$.pipe(
    filter(e => !!e),
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

  public selectedPage;

  public textFlow: TextFlow = AppConfig.evtSettings.edition.defaultTextFlow || 'prose';
  public enableProseVersesToggler = AppConfig.evtSettings.edition.proseVersesToggler;
  public get proseVersesTogglerIcon(): EvtIconInfo {
    return { icon: this.textFlow === 'prose' ? 'align-left' : 'align-justify', iconSet: 'fas' };
  }

  public isMultiplePageFlow$ = this.currentStatus$.pipe(
    map((x) => x.editionLevel.id === 'critical' && x.currentViewMode.id !== 'imageText'),
    shareReplay(1),
  );

  private showSecondaryContent = false;
  private subscriptions: Subscription[] = [];

  constructor(
    public evtModelService: EVTModelService,
    public evtStatus: EVTStatusService,
  ) {
  }

  ngOnInit() {
    if (this.editionLevelID === 'critical') {
      this.textFlow = AppConfig.evtSettings.edition.defaultTextFlow || 'verses';
    }
    if (!this.enableProseVersesToggler) {
      this.textFlow = undefined;
    }
  }

  isSecondaryContentOpened(): boolean {
    return this.showSecondaryContent;
  }

  toggleSecondaryContent(newContent: string) {
    this.showSecondaryContent = this.secondaryContent !== newContent;
    this.secondaryContent = this.showSecondaryContent ? newContent : '';
  }

  getSecondaryContent(): string {
    return this.secondaryContent;
  }

  toggleProseVerses() {
    this.textFlow = this.textFlow === 'prose' ? 'verses' : 'prose';
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
