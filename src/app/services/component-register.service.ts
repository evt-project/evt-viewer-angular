import { Injectable, Type } from '@angular/core';
import { Map } from '../utils/js-utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENT_MAP: Map<Type<any>> = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const register = (dataType: Type<any>) => (cls: Type<any>) => { COMPONENT_MAP[dataType.name] = cls; };


@Injectable({
  providedIn: 'root',
})
export class ComponentRegisterService {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getComponent(dataType: Type<any>) {
    return COMPONENT_MAP[dataType.name];
  }
}
