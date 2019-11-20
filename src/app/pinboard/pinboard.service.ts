import { Injectable, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PinboardService {
  private items$ = new BehaviorSubject({});
  @Output() pinboardChanged: EventEmitter<{ types?: any, items?: any }> = new EventEmitter();

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
        pinDate: item.pinDate ? item.pinDate : new Date()
      };
    }
    console.log(items);
    this.items$.next(items);
    this.getItemsTypes().subscribe(types => this.pinboardChanged.emit({ items, types }));
  }

  isItemPinned(item) {
    const itemId = item.id || item.path;
    const items = this.items$.getValue();
    console.log(items[itemId]);
    return items[itemId];
  }

  getItems(types?: string[]): Observable<any[]> {
    return this.items$.pipe(
      map(items => {
        let itemsArray = Array.from(Object.keys(items), (key) => items[key]);
        if (types && types.length > 0) {
          itemsArray = itemsArray.filter(item => item.pinType && types.indexOf(item.pinType) >= 0);
        }
        return itemsArray;
      }));
  }

  getItemsTypes(): Observable<string[]> {
    return this.items$.pipe(
      map(items => {
        const types = [];
        for (const key in items) {
          if (items[key].pinType && types.indexOf(items[key].pinType) < 0) {
            types.push(items[key].pinType);
          }
        }
        return types;
      }));
  }
}
