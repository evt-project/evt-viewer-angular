import { Component, Input } from '@angular/core';
import { EditionDataService } from 'src/app/services/edition-data.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'evt-text-panel',
  templateUrl: './text-panel.component.html',
  styleUrls: ['./text-panel.component.scss']
})
export class TextPanelComponent {
  // TEMP:
  public secondaryContent = '';
  public selectedPage = 'p1';
  private showSecondaryContent = false;

  public text = this.editionDataService.parsedEditionSource$
    .pipe(map((data) => {
      if (data) {
        return data.outerHTML;
      }
    }));

  constructor(
    private editionDataService: EditionDataService,
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
}
