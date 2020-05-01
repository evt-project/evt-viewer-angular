import { Input } from '@angular/core';
import { EntitiesSelectItem } from './entities-select/entities-select.component';

// tslint:disable-next-line: no-any
export type Constructor<T> = new (...args: any[]) => T;
// Boilerplate for applying mixins.
export class Base { }

export function Highlightable<T extends Constructor<{}>>(base: T) {
  class Temporary extends base {
    @Input() highlightData: { highlight: boolean, highlightColor: string };
    @Input() itemsToHighlight: EntitiesSelectItem[];
  }

  return Temporary;
}
