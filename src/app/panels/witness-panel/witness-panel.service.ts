import { Injectable } from "@angular/core";

@Injectable() // at the moment provided in the WitnessPanelComponent 
export class WitnessPanelService {
  witnessId: string;
  anchestorsIds: string[]

  constructor(
  ) { }
}
