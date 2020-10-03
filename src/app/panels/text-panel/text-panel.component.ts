import { Component, Input, OnDestroy, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { delay, distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';
import { EvtIconInfo } from 'src/app/ui-components/icon/icon.component';
import { AppConfig, EditionLevel, EditionLevelType } from '../../app.config';
import { EntitiesSelectItem } from '../../components/entities-select/entities-select.component';
import { Page } from '../../models/evt-models';
import { EVTModelService } from '../../services/evt-model.service';
import { EvtIconInfo } from '../../ui-components/icon/icon.component';

@Component({
  selector: 'evt-text-panel',
  templateUrl: './text-panel.component.html',
  styleUrls: ['./text-panel.component.scss'],
})
export class TextPanelComponent implements OnDestroy {
  @Input() hideEditionLevelSelector: boolean;

  @Input() pageID: string;
  public currentPage$ = new BehaviorSubject<Page>(undefined);
  public currentPageId$ = this.currentPage$.pipe(
    map(p => p?.id),
  );
  @Output() pageChange: Observable<Page> = this.currentPage$.pipe(
    filter(p => !!p),
    distinctUntilChanged(),
  );

  @Input() editionLevelID: EditionLevelType;
  public currentEdLevel$ = new BehaviorSubject<EditionLevel>(undefined);
  public currentEdLevelId$ = this.currentEdLevel$.pipe(
    map(e => e?.id),
  );
  @Output() editionLevelChange: Observable<EditionLevel> = this.currentEdLevel$.pipe(
    filter(e => !!e),
    distinctUntilChanged(),
  );

  public currentStatus$ = combineLatest([
    this.currentPage$,
    this.currentEdLevel$,
  ]).pipe(
    delay(0),
    filter(([page, editionLevel]) => !!page && !!editionLevel),
    map(([page, editionLevel]) => ({ page, editionLevel })),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    shareReplay(1),
  );

  public itemsToHighlight$ = new Subject<EntitiesSelectItem[]>();
  public secondaryContent = '';
  private showSecondaryContent = false;

  public selectedPage;

  public textFlow: 'prose' | 'verses' = 'prose';
  public enableProseVersesToggler = AppConfig.evtSettings.edition.proseVersesToggler;
  public get proseVersesTogglerIcon(): EvtIconInfo {
    return { icon: this.textFlow === 'prose' ? 'align-left' : 'align-justify', iconSet: 'fas' };
  }

  private subscriptions: Subscription[] = [];

  constructor(
    public evtModelService: EVTModelService,
  ) {
  }

  isSecondaryContentOpened(): boolean {
    return this.showSecondaryContent;
  }

  toggleSecondaryContent(newContent: string) {
    if (this.secondaryContent !== newContent) {
      this.showSecondaryContent = true;
      this.secondaryContent = newContent;
    } else {
      this.showSecondaryContent = false;
      this.secondaryContent = '';
    }
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
