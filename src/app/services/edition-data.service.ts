import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, publishReplay, refCount, tap } from 'rxjs/operators';
import { AppConfig } from '../app.config';
import { OriginalEncodingNodeType } from '../models/evt-models';
import { parseXml } from '../utils/xml-utils';

@Injectable({
  providedIn: 'root',
})
export class EditionDataService {
  private editionUrls = AppConfig.evtSettings.files.editionUrls || [];
  public parsedEditionSource$: Observable<OriginalEncodingNodeType> = this.loadAndParseEditionData();

  constructor(
    private http: HttpClient,
  ) {
  }

  private loadAndParseEditionData() {
    const editionUrl = this.editionUrls[0];

    return this.http.get(editionUrl, { responseType: 'text' }).pipe(
      map(source => parseXml(source)),
      mergeMap((editionData) => this.loadXIinclude(editionData, editionUrl.substring(0, editionUrl.lastIndexOf('/') + 1))),
      publishReplay(1),
      refCount(),
      catchError(() => this.handleLoadingError()),
    );
  }

  loadXIinclude(doc: HTMLElement, baseUrlPath: string) {
    const filesToInclude = Array.from(doc.getElementsByTagName('xi:include'));
    const xiIncludeLoadsSubs = filesToInclude.map(element =>
      this.http.get(baseUrlPath + element.getAttribute('href'), { responseType: 'text' })
        .pipe(
          tap((fileData) => {
            const includedDoc = parseXml(fileData);
            const fileXpointer = element.getAttribute('xpointer');
            let includedTextElem: Node;
            if (fileXpointer) {
              includedTextElem = doc.querySelector(`[*|id="${fileXpointer}"]`) || includedDoc.querySelector('text');
            } else {
              includedTextElem = includedDoc.querySelector('text');
            }
            // element.parentNode.replaceChild(includedTextElem, element);
            element.parentNode.appendChild(includedTextElem);
          }),
          catchError(_ => {
            Array.from(element.getElementsByTagName('xi:fallback')).map((el) => {
              const divEl = document.createElement('div');
              divEl.classList.add('xiinclude-fallback');
              divEl.setAttribute('xml:id', element.getAttribute('xpointer'));
              divEl.innerHTML = `<p>${el.innerHTML}</p>`;

              return divEl;
            }).forEach((el) => element.parentNode.replaceChild(el, element));

            return of(doc);
          }),
        ));
    if (xiIncludeLoadsSubs.length > 0) {
      return forkJoin(xiIncludeLoadsSubs).pipe(map(() => doc));
    }

    return of(doc);
  }

  private handleLoadingError() {
    // TODO: TEMP
    const errorEl: HTMLElement = document.createElement('div');
    if (!this.editionUrls || this.editionUrls.length === 0) {
      errorEl.textContent = 'Missing configuration for edition files. Data cannot be loaded.';
    } else {
      errorEl.textContent = 'There was an error in loading edition files.';
    }

    return of(errorEl);
  }
}
