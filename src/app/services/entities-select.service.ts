import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { EntitiesSelectItem } from '../components/entities-select/entities-select.component';

@Injectable({
  providedIn: 'root',
})
export class EntitiesSelectService {
  public updateSelection$ = new Subject<EntitiesSelectItem[]>();
  public selectedItems$ = this.updateSelection$.pipe(
    shareReplay(1),
  );
}
