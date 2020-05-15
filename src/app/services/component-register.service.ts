import { Injectable, Type } from '@angular/core';
import { Map } from '../utils/js-utils';

// tslint:disable-next-line: no-any
const COMPONENT_MAP: Map<Type<any>> = {};

// tslint:disable-next-line: no-any
export function register(dataType: Type<any>) {
  // tslint:disable-next-line: no-any
  return (cls: Type<any>) => {
      COMPONENT_MAP[dataType.name] = cls;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ComponentRegisterService {

  // tslint:disable-next-line: no-any
  getComponent(dataType: Type<any>) {
    return COMPONENT_MAP[dataType.name];
  }
}
