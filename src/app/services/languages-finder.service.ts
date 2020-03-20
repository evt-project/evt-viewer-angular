import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LanguagesFinderService {

  public getLanguages(): string[] {
    return ['assets/i18n/it.json', 'assets/i18n/en.json'];
  }
}
