import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { BibliographicEntry } from 'src/app/models/evt-models';

@Component({
  selector: 'evt-biblio-entry',
  templateUrl: './biblio.component.html',
  styleUrls: ['./biblio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BiblioEntryComponent {
  @Input() data: BibliographicEntry;

  public showList = AppConfig.evtSettings.ui.biblTab.propsToShow;
  public showAttrNames = AppConfig.evtSettings.ui.biblTab.showAttrNames;
  public showEmptyValues = AppConfig.evtSettings.ui.biblTab.showEmptyValues;
  public inline = AppConfig.evtSettings.ui.biblTab.inline;
  public isCommaSeparated = AppConfig.evtSettings.ui.biblTab.commaSeparated;
  public showMainElemTextContent = AppConfig.evtSettings.ui.biblTab.showMainElemTextContent;

}

