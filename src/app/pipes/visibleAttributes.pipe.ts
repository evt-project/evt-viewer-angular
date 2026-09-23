import { Pipe } from "@angular/core";
import { EVT_PREFIX } from "../models/constants";

@Pipe({ name: 'visibleAttributes', pure: true })
export class VisibleAttributesPipe {
  transform(attributes: Record<string, any>) {
    return Object.entries(attributes || {})
      .filter(kvp => !this.idStartsWithEvtPrefix(kvp))
      .map(([key, value]) => ({ key, value }));
  }

  private idStartsWithEvtPrefix = ([key, value]: [string, unknown]) =>
    key !== 'id' || (typeof value === 'string' && value.startsWith(EVT_PREFIX));
}