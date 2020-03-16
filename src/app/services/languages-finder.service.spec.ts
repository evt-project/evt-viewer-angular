import { TestBed } from '@angular/core/testing';

import { LanguagesFinderService } from './languages-finder.service';

describe('LanguagesFinderService', () => {
  let service: LanguagesFinderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguagesFinderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
