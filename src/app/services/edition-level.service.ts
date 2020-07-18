import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig, EditionLevelType } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class EditionLevelService {

  get defaultEditionLevel(): EditionLevelType {
    const defaultConfig = AppConfig.evtSettings.edition.defaultEdition;
    const availableEditionLevels = AppConfig.evtSettings.edition.availableEditionLevels?.filter((e => !e.disabled)) ?? [];
    let defaultEdition = availableEditionLevels[0];
    if (defaultConfig) {
      defaultEdition = availableEditionLevels.find(e => e.id === defaultConfig) ?? defaultEdition;
    }

    return defaultEdition?.id;
  }

  constructor(
    private router: Router,
  ) {
  }

  handleEditionLevelChange(currentRoute: ActivatedRoute, editionLevel: EditionLevelType, paramName: string) {
    if (editionLevel) {
      const params = {
        ...currentRoute.snapshot.params,
        [paramName]: editionLevel,
      };
      this.router.navigate([params], { relativeTo: currentRoute });
    }
  }

}
