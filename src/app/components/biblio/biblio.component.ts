import { Component, Input, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { BibliographicEntry } from 'src/app/models/evt-models';

@Component({
  selector: 'evt-biblio-entry',
  templateUrl: './biblio.component.html',
  styleUrls: ['./biblio.component.scss'],
})
export class BiblioEntryComponent implements OnInit {

  @Input() data: BibliographicEntry;

  public showList = AppConfig.evtSettings.edition.biblView.propToShow;
  public showAttrNames = AppConfig.evtSettings.edition.biblView.showAttrNames;
  public showEmptyValues = AppConfig.evtSettings.edition.biblView.showEmptyValues;
  public inline = AppConfig.evtSettings.edition.biblView.inline;
  public comaSeparated = AppConfig.evtSettings.edition.biblView.comaSeparated;
  public showMainElemTextContent = AppConfig.evtSettings.edition.biblView.showMainElemTextContent;

  public showSpan = this.getSpanStyle();

  public getSpanStyle() {
    if (this.comaSeparated) {
      return {
        'margin-left': '-0.1rem',
        'display': 'inline-block',
      };
    }

    return { 'display': 'none' };
  }

  ngOnInit() {
  }

}

