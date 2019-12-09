import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PageData } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { Subscription } from 'rxjs';
import { EVTModelService } from 'src/app/services/evt-model.service';

@Component({
  selector: 'evt-text-panel',
  templateUrl: './text-panel.component.html',
  styleUrls: ['./text-panel.component.scss']
})
@register
export class TextPanelComponent implements OnInit, OnDestroy {
  @Input() page: string;
  @Output() pageChange = new EventEmitter<PageData>();
  public secondaryContent = '';
  private showSecondaryContent = false;

  public pages$ = this.evtModelService.getPages();
  public selectedPage;
  private subscriptions: Subscription[] = [];

  constructor(
    public evtModelService: EVTModelService,
  ) {
  }

  ngOnInit() {
    this.subscriptions.push(
      this.pages$.subscribe((pages) => {
        if (pages && pages.length > 0) {
          if (!this.page || !pages.find((p) => p.id === this.page)) {
            this.page = pages[0].id;
            this.changePage(pages[0]);
          } else {
            this.changePage(pages.find((p) => p.id === this.page));
          }
        }
      }),
    );
  }

  changePage(page: PageData) {
    this.pageChange.next(page);
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
