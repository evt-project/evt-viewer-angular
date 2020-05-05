import { Component, Input, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, merge, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { EditionLevelType } from '../../app.config';
import { EntitiesSelectItem } from '../../components/entities-select/entities-select.component';
import { EVTModelService } from '../../services/evt-model.service';

@Component({
  selector: 'evt-text-panel',
  templateUrl: './text-panel.component.html',
  styleUrls: ['./text-panel.component.scss'],
})
export class TextPanelComponent implements OnDestroy {
  @Input() hideEditionLevelSelector: boolean;

  private pid: string;
  @Input() set pageID(v: string) {
    this.pid = v;
    this.pageIDChange.next(this.pid);
  }
  get pageID() { return this.pid; }
  pageIDChange = new Subject<string>();

  public pages$ = this.evtModelService.pages$;

  public itemsToHighlight$ = new Subject<EntitiesSelectItem[]>();

  @Output() pageChange = combineLatest([
    merge(
      this.route.params.pipe(
        map((params) => params.page),
      ),
      this.pageIDChange,
    ),
    this.pages$,
  ]).pipe(
    filter(([_, pages]) => !!pages && pages.length > 0),
    map(([id, pages]) => !id ? pages[0] : pages.find((p) => p.id === id)),
  ).pipe(
    distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y)),
  );

  private elId: EditionLevelType;
  editionLevelIDChange = new BehaviorSubject<EditionLevelType>(undefined);
  @Input() set editionLevelID(el: EditionLevelType) {
    this.elId = el;
    this.editionLevelIDChange.next(this.elId);
  }
  get editionLevelID() { return this.elId; }
  @Output() editionLevelChange: Observable<EditionLevelType> = this.editionLevelIDChange.pipe(
    distinctUntilChanged((x, y) => x === y),
  );

  public secondaryContent = '';
  private showSecondaryContent = false;

  public selectedPage;
  private subscriptions: Subscription[] = [];

  constructor(
    public evtModelService: EVTModelService,
    private route: ActivatedRoute,
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
