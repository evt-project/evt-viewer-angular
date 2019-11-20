import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { StructureXmlParserService } from '../../services/xml-parsers/structure-xml-parser.service';
import { PageData } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { Subscription } from 'rxjs';
import { GenericParserService } from 'src/app/services/xml-parsers/generic-parser.service';
import { delay } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

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
  public isBusy$ = this.genericParser.isBusy;
  private subscriptions: Subscription[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    public editionStructure: StructureXmlParserService,
    public genericParser: GenericParserService
  ) {

  }

  ngOnInit() {
    this.spinner.show('textPanelSpinner');
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
      this.genericParser.isBusy.subscribe(isBusy => {
        if (!isBusy) {
          this.spinner.hide('textPanelSpinner');
        }
      }));
  }

  changePage(page: PageData) {
    if (page) {
      this.spinner.show('textPanelSpinner');
      this.genericParser.addTask.next(page.content.length);
    }
    setTimeout(() => this.selectedPage = page);
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
