import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditionLevelType } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class EditionLevelService {

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
