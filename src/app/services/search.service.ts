import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private readonly _searchQuery$ = new BehaviorSubject('');
  readonly searchQuery$ = this._searchQuery$.asObservable();

  constructor() { }

  search(searchQuery: string) {
    if(!searchQuery) return;
    this._searchQuery$.next(searchQuery);
  }
}
