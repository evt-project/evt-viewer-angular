import { Injectable } from '@angular/core';
import { filter, fromEvent, share } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {

  private readonly keydown$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
    share() // one stream for all subscribers, without replay since later subscribers only cares about future events
  );

  /**
   * Observable for the Escape key
   */
  readonly escape$ = this.key$('Escape')

  /**
   * General observable to listen for any key
   * @param key the key to listen for
   * @returns the observable for the given key 
   */
  key$(key: string) {
    return this.keydown$.pipe(
      filter(event => event.key === key)
    );
  }
}
