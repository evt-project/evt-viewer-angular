import { Injectable, Type } from '@angular/core';
import { Map } from '../utils/jsUtils';

const COMPONENT_MAP: Map<Type<any>> = {};

export function register(cls: Type<any>): void {
  COMPONENT_MAP[cls.name] = cls;
}

@Injectable({
  providedIn: 'root'
})
export class ComponentRegisterService {

  getComponent(name: string) {
    return COMPONENT_MAP[name];
  }
}
