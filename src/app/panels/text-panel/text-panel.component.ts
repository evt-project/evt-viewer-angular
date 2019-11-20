import { Component, OnInit } from '@angular/core';
import { StructureXmlParserService } from 'src/app/services/xml-parsers/structure-xml-parser.service';
import { PageData } from 'src/app/models/evt-models';

@Component({
  selector: 'evt-text-panel',
  templateUrl: './text-panel.component.html',
  styleUrls: ['./text-panel.component.scss']
})
export class TextPanelComponent implements OnInit {
  public secondaryContent = '';
  private showSecondaryContent = false;

  public pages$ = this.editionStructure.getPages();
  public selectedPage;
  public currentPageContent = [];

  constructor(
    public editionStructure: StructureXmlParserService,
  ) {

  }

  ngOnInit() {
    // TEMP
    this.pages$.subscribe((pages) => {
      if (pages && pages.length > 0) {
        this.selectedPage = pages[0].id;
        this.currentPageContent = pages[0].content;
      }
    });
  }

  changePage(page: PageData) {
    this.currentPageContent = [...page.content];
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
