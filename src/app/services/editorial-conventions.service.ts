import { Injectable } from '@angular/core';
import { AttributesMap } from 'ng-dynamic-component';
import { AppConfig } from '../app.config';
import { EditorialConvention } from '../models/evt-models';

@Injectable({
  providedIn: 'root',
})
export class EditorialConventionsService {
  getConfigOrDefault(name: string, attributes: AttributesMap): EditorialConvention {
    const externalConfigs = this.getExternalConfigsOrEmpty().filter(x => x.element === name);
    if (!externalConfigs.length) return null;

    for (const config of externalConfigs) {
      for (const cAttribute of Object.values(config.attributes)) {
        const keys = Object.keys(cAttribute);
        const isMatch = keys.every(key => {
          const cValue = cAttribute[key];
          const value = attributes[key];
          return cValue.includes(value);
        });
        if (isMatch) return config;
      }
    }
    return externalConfigs[0];
  }

  private getExternalConfigsOrEmpty(): EditorialConvention[] {
    const customsArray = AppConfig.evtSettings.editionTextSources.map(x => x.editorialConventionsConfig);
    if (!customsArray) return [];

    return customsArray.reduce((acc, customs) => {
      if (!customs) return acc;
      const mapped = Object.keys(customs).map((key) => ({
        element: customs[key].markup.element,
        attributes: customs[key].markup.attributes,
        layouts: customs[key].layouts ?? {},
      }));
      return acc.concat(mapped);
    }, [] as EditorialConvention[]);
  }
}
