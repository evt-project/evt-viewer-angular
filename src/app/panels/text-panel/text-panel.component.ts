import { Component, Input, OnDestroy, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { EditionLevelType } from '../../app.config';
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
  public currentPage$ = new Subject<Page>();
  set currentPage(p: Page) {
    this.currentPage$.next(p);
    this.currentPageId$.next(p.id);
  }
  @Output() pageChange: Observable<Page> = this.currentPage$.pipe(
    filter(p => !!p),
    distinctUntilChanged(),
  );

  private elId: EditionLevelType;
  editionLevelIDChange = new BehaviorSubject<EditionLevelType>(undefined);
  @Input() set editionLevelID(el: EditionLevelType) {
    this.elId = el;
    this.editionLevelIDChange.next(this.elId);
  }
  get editionLevelID() { return this.elId; }
  @Output() editionLevelChange: Observable<EditionLevelType> = this.editionLevelIDChange.pipe(
    filter(p => !!p),
    distinctUntilChanged((x, y) => x === y),
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
