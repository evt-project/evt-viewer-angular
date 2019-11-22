import { Injectable } from '@angular/core';
import { Subject, Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { map, publishReplay, refCount, catchError } from 'rxjs/operators';
import { parseXml } from '../utils/xmlUtils';

@Injectable({
  providedIn: 'root'
})
export class EditionDataService {
  private editionUrls = AppConfig.evtSettings.files.editionUrls || [];
  public parsedEditionSource$: Observable<HTMLElement> = this.loadAndParseEditionData();

  constructor(
    private http: HttpClient,
  ) {
  }

  private loadAndParseEditionData() {
    return this.http.get(this.editionUrls[0], { responseType: 'text' }).pipe(
      map(source => {
        let editionDoc: HTMLElement;
        if (typeof source !== 'object' && typeof source === 'string') {
          editionDoc = parseXml(source);
        } else {
          editionDoc = source;
        }
        return editionDoc;
      }),
      publishReplay(1),
      refCount(),
      catchError(() => this.handleLoadingError()));
  }

  private handleLoadingError() {
    // TEMP
    const errorEl = document.createElement('div');
    if (!this.editionUrls || this.editionUrls.length === 0) {
      errorEl.textContent = 'Missing configuration for edition files. Data cannot be loaded.';
    } else {
      errorEl.textContent = 'There was an error in loading edition files.';
    }
    return of(errorEl);
  }
}
