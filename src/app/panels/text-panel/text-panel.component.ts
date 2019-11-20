import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { StructureXmlParserService } from '../../services/xml-parsers/structure-xml-parser.service';
import { PageData } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'evt-text-panel',
  templateUrl: './text-panel.component.html',
  styleUrls: ['./text-panel.component.scss']
})
@register
export class TextPanelComponent implements OnInit, OnDestroy {
  @Input() page: string;
  @Output() pageChange: EventEmitter<PageData> = new EventEmitter();
  public secondaryContent = '';
  private showSecondaryContent = false;

  public pages$ = this.editionStructure.getPages();
  public selectedPage;

  private subscriptions: Subscription[] = [];

  constructor(
    public editionStructure: StructureXmlParserService,
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
      }));
  }

  changePage(page: PageData) {
    this.selectedPage = page;
    this.pageChange.emit(page);
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
