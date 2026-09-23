import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorsService {
  private _errors$ = new BehaviorSubject<SourceError[]>([]);
  errors$ = this._errors$.asObservable();

  private _isLoading$ = new BehaviorSubject<boolean>(true);
  isLoading$ = this._isLoading$.asObservable();

  constructor() { }

  logError(error: string, elements?: HTMLElement[]) {
    const outherHtmlsOrDefault = elements?.map(x => x.outerHTML) ?? [];
    const sourceError: SourceError = { errorMessage: error, type: 'error', outerHTMLs: outherHtmlsOrDefault }
    const errors = this._errors$.getValue();
    console.error(error, elements);
    this._errors$.next([...errors, sourceError]);
  }

  logWarning(error: string, elements?: HTMLElement[]) {
    const outherHtmlsOrDefault = elements?.map(x => x.outerHTML) ?? [];
    const sourceError: SourceError = { errorMessage: error, type: 'warning', outerHTMLs: outherHtmlsOrDefault }
    const errors = this._errors$.getValue();
    if (errors.some(e => e.errorMessage === sourceError.errorMessage)) {
      return;
    }

    console.warn(error, elements);
    this._errors$.next([...errors, sourceError]);
  }

  loadingStart() {
    this._isLoading$.next(true);
  }

  loadingEnd() {
    this._isLoading$.next(false);
  }

  dismissAll() {
    this._errors$.next([]);
  }

  dismiss(error: SourceError) {
    const newValue = this._errors$.value.filter(x => x !== error);
    this._errors$.next(newValue);
  }
}

export interface SourceError {
  errorMessage: String,
  outerHTMLs: string[];
  type: 'error' | 'warning',
}
