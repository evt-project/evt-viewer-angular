import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PageData } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { Subscription, Subject, merge, combineLatest } from 'rxjs';
import { EVTModelService } from 'src/app/services/evt-model.service';
import { filter, shareReplay, map, distinctUntilChanged, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'evt-text-panel',
  templateUrl: './text-panel.component.html',
  styleUrls: ['./text-panel.component.scss']
})
@register
export class TextPanelComponent implements OnDestroy {
  private pid: string;
  @Input() set pageID(v: string) {
    this.pid = v;
    this.pageIDChange.next(this.pid);
  }
  get pageID() { return this.pid; }
  pageIDChange = new Subject<string>();

  public pages$ = this.evtModelService.getPages().pipe(
    shareReplay(1),
  );

  @Output() pageChange = combineLatest([
    merge(
      this.route.params.pipe(
        map((params) => params.page)
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
