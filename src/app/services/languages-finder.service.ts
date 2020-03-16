import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import langs from 'src/assets/bibliography-features/languages.json';

@Injectable({
  providedIn: 'root',
})
export class LanguagesFinderService {

  constructor(private http: HttpClient) {
  }

  // TODO prune 'GET http://localhost:4205/assets/i18n/[...].json 404 (Not Found)' messages
  public getLanguages() {
    const observables = langs.map(lang => {
      return this.http.get(`/assets/i18n/${lang}.json`).pipe(
        catchError(() => of(undefined)),
      );
    });

    return forkJoin(observables).pipe(
      map(results => results.filter(x => !!x)),
    );
  }
}
