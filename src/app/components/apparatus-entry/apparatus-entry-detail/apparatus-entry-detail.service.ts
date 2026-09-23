import { Injectable } from '@angular/core';
import { ApparatusEntry } from 'src/app/models/evt-models';

@Injectable() // at the moment provided in the ApparatusEntryDetailComponent
export class ApparatusEntryDetailService {
  apparatusEntry: ApparatusEntry;

  constructor() { }
}
