import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { EntitiesSelectItem } from '../components/entities-select/entities-select.component';
import { AttributesData } from '../models/evt-models';

@Injectable({
  providedIn: 'root',
})
export class EntitiesSelectService {
  public updateSelection$ = new Subject<EntitiesSelectItem[]>();
  public selectedItems$ = this.updateSelection$.pipe(
    shareReplay(1),
  );

  public getClassNameFromValue(value) {
    return value.toLowerCase().replace(/\s/g, '').replace(/(\[.*?\])/g, '');
  }

  public getAttributesFromValue(value): Array<{ key: string, value: string }> {
    return (value.toLowerCase().replace(/\s/g, '').match(/(\[.*?\])/g) || [])
      .map(i => i.replace(/(\[|\]|\')/g, '').split('=')).map(i => ({ key: i[0], value: i[1] }));
  }

  public matchClassAndAttributes(valueForCheck: string, attributesToCheck: AttributesData, classToCheck: string) {
    return valueForCheck.split(',')
      .some(v => this.matchClass(v, classToCheck) && this.matchAttributes(v, attributesToCheck));
  }

  public matchClass(classForCheck: string, classToCheck: string) {
    return classToCheck === this.getClassNameFromValue(classForCheck);
  }

  public matchAttributes(attributesForCheck: string, attributesToCheck: AttributesData) {
    return this.getAttributesFromValue(attributesForCheck).every(a => attributesToCheck[a.key] === a.value);
  }
}
