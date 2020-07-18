import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig, EditionLevelType } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class EditionLevelService {

  get defaultEditionLevel(): EditionLevelType {
    const availableEditionLevels = AppConfig.evtSettings.edition.availableEditionLevels?.filter((e => !e.disabled)) ?? [];

    return availableEditionLevels[0]?.id;
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
