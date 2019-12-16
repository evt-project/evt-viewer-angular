import { Injectable, Type } from '@angular/core';
import { Map } from '../utils/js-utils';

// tslint:disable-next-line: no-any
const COMPONENT_MAP: Map<Type<any>> = {};

// tslint:disable-next-line: no-any
export function register(cls: Type<any>): void {
  COMPONENT_MAP[cls.name] = cls;
}

@Injectable({
  providedIn: 'root',
})
export class ComponentRegisterService {

  getComponent(name: string) {
    return COMPONENT_MAP[name];
  }
}
