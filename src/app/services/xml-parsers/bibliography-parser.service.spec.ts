import { TestBed } from '@angular/core/testing';

import { BibliographyParserService } from './bibliography-parser.service';

describe('BibliographyParserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BibliographyParserService = TestBed.get(BibliographyParserService);
    expect(service).toBeTruthy();
  });
});
