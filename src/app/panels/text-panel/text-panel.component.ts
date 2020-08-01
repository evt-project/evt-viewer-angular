import { Component, Input, OnDestroy, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { delay, distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';
import { EditionLevel, EditionLevelType } from '../../app.config';
import { EntitiesSelectItem } from '../../components/entities-select/entities-select.component';
import { Page } from '../../models/evt-models';
import { EVTModelService } from '../../services/evt-model.service';

@Component({
  selector: 'evt-text-panel',
  templateUrl: './text-panel.component.html',
  styleUrls: ['./text-panel.component.scss'],
})
export class TextPanelComponent implements OnDestroy {
  @Input() hideEditionLevelSelector: boolean;

  @Input() set pageID(p: string) {
    this.currentPageId$.next(p);
  }
  public currentPageId$ = new BehaviorSubject<string>(undefined);
  public currentPage$ = new BehaviorSubject<Page>(undefined);
  set currentPage(p: Page) {
    this.currentPage$.next(p);
    this.currentPageId$.next(p?.id);
  }
  @Output() pageChange: Observable<Page> = this.currentPage$.pipe(
    filter(p => !!p),
    distinctUntilChanged(),
  );

  @Input() set editionLevelID(e: EditionLevelType) {
    this.currentEdLevelId$.next(e);
  }
  public currentEdLevelId$ = new BehaviorSubject<EditionLevelType>(undefined);
  public currentEdLevel$ = new BehaviorSubject<EditionLevel>(undefined);
  set currentEdLevel(e: EditionLevel) {
    this.currentEdLevel$.next(e);
    this.currentEdLevelId$.next(e.id);
  }
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
