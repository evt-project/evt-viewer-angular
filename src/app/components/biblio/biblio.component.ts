import { Component, Input } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { BibliographicEntry } from 'src/app/models/evt-models';

@Component({
  selector: 'evt-biblio-entry',
  templateUrl: './biblio.component.html',
  styleUrls: ['./biblio.component.scss'],
})
export class BiblioEntryComponent {
  @Input() data: BibliographicEntry;

  public showList = AppConfig.evtSettings.edition.biblView.propsToShow;
  public showAttrNames = AppConfig.evtSettings.edition.biblView.showAttrNames;
  public showEmptyValues = AppConfig.evtSettings.edition.biblView.showEmptyValues;
  public inline = AppConfig.evtSettings.edition.biblView.inline;
  public isCommaSeparated = AppConfig.evtSettings.edition.biblView.commaSeparated;
  public showMainElemTextContent = AppConfig.evtSettings.edition.biblView.showMainElemTextContent;

}

