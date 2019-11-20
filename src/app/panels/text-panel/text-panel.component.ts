import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { StructureXmlParserService } from '../../services/xml-parsers/structure-xml-parser.service';
import { PageData } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { ParsedElement } from '../../services/xml-parsers/generic-parser.service';

@Component({
  selector: 'evt-text-panel',
  templateUrl: './text-panel.component.html',
  styleUrls: ['./text-panel.component.scss']
})
@register
export class TextPanelComponent implements OnInit {
  public secondaryContent = '';
  private showSecondaryContent = false;

  public pages$ = this.editionStructure.getPages();
  public selectedPage;
  public currentPageContent$ = new Subject<ParsedElement[]>();

  constructor(
    public editionStructure: StructureXmlParserService,
  ) {

  }

  ngOnInit() {
    // TEMP
    this.pages$.subscribe((pages) => {
      if (pages && pages.length > 0) {
        this.selectedPage = pages[0].id;
        this.currentPageContent$.next(pages[0].content);
      }
    });
  }

  changePage(page: PageData) {
    this.currentPageContent$.next(page.content);
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
}
