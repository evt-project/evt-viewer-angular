import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PinboardService {
  private items$ = new BehaviorSubject({});

  /**
   * @todo Handle Groups of similar elements
   * @todo Handle page/document/edition reference
   * @todo Handle saving in local storage and retrieving from it on loading
   */
  toggleItem(item, additionalData?: { pinType?: string, renderer?: string }) {
    const itemId = item.id || item.path;
    const items = this.items$.getValue();
    if (items[itemId]) {
      delete items[itemId];
    } else {
      items[itemId] = {
        ...item,
        renderer: additionalData.renderer,
        pinType: additionalData.pinType || 'GenericPin',
        pinDate: item.pinDate ? item.pinDate : new Date(),
      };
    }
    this.items$.next(items);
  }

  isItemPinned(item) {
    const itemId = item.id || item.path;
    const items = this.items$.getValue();

    return items[itemId];
  }

  // tslint:disable-next-line: no-any
  getItems(types?: string[]): Observable<any[]> { // TODO get rid of any
    return this.items$.pipe(
      map(items => {
        let itemsArray = Array.from(Object.keys(items), (key) => items[key]);
        if (types && types.length > 0) {
          itemsArray = itemsArray.filter(item => item.pinType && types.indexOf(item.pinType) >= 0);
        }

        return itemsArray;
      }));
  }
}
