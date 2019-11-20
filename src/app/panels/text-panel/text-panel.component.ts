import { Component, OnInit } from '@angular/core';
import { EditionDataService } from 'src/app/services/edition-data.service';
import { map } from 'rxjs/operators';
import { StructureXmlParserService } from 'src/app/services/xml-parsers/structure-xml-parser.service';

@Component({
  selector: 'evt-text-panel',
  templateUrl: './text-panel.component.html',
  styleUrls: ['./text-panel.component.scss']
})
export class TextPanelComponent implements OnInit {
  // TEMP:
  public secondaryContent = '';
  private showSecondaryContent = false;

  public pages$ = this.editionStructure.getPages().pipe(
    map((pages) => pages.map((page) => ({ id: page.id, label: page.label }))));

  public selectedPage;

  public text = this.editionDataService.parsedEditionSource$
    .pipe(map((data) => {
      if (data) {
        return data.outerHTML;
      }
    }));

  constructor(
    public editionStructure: StructureXmlParserService,
    private editionDataService: EditionDataService,
  ) {

  }

  ngOnInit() {
    // TEMP
    this.editionStructure.getPages().subscribe((pages) => this.selectedPage = pages && pages.length > 0 ? pages[0].id : undefined);
  }

  pageSelected() {
    console.log('pageSelected');
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
