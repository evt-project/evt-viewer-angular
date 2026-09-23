import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { ApparatusEntry, ApparatusEntryExponent } from '../models/evt-models';
import { EVTStatusService } from './evt-status.service';
import { NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HoverService {
  readonly hoveredTextOrDefault$ = new BehaviorSubject<TextHoverArgs>(null);
  readonly highlightedAppExponents$ = new BehaviorSubject<ApparatusEntryExponent[]>([]);
  readonly selectedApparatusEntries$ = new BehaviorSubject<ApparatusEntry[]>([]);

  constructor(
    private statusService: EVTStatusService,
    private router: Router,
    //private structureService: StructureXmlParserService
  ) {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationStart),
    ).subscribe(() => {
      this.hoveredTextOrDefault$.next(null);
      this.highlightedAppExponents$.next([]);
      this.selectedApparatusEntries$.next([]);
    });
  }

  selectApparatusEntry(apps: ApparatusEntry[]) {
    const view = this.statusService.updateViewMode$.value;
    if (view.id === 'readingText') {
      this.selectedApparatusEntries$.next([...apps]);
    }
    else {
      // moves the argument apps to the end of the stream
      const appIdsToAdd = new Set(apps.map(app => app.additionalAttributes.exponentId));
      const value = this.selectedApparatusEntries$.value.filter(x => !appIdsToAdd.has(x.additionalAttributes.exponentId));
      this.selectedApparatusEntries$.next([...value, ...apps]);
    }
  }

  toggleApparatusEntry(app: ApparatusEntry) {
    const newIds = [{ app, exponentId: app.additionalAttributes.exponentId }];
    const selectedIds = this.selectedApparatusEntries$.value.map(app => ({ app, exponentId: app.additionalAttributes.exponentId }));

    const selectedExponentIds = new Set(selectedIds.map(({ exponentId }) => exponentId));
    const entriesToAdd = newIds.filter(({ exponentId }) => !selectedExponentIds.has(exponentId));

    const view = this.statusService.updateViewMode$.value;
    if (view.id === 'readingText') {
      const newValue = [...entriesToAdd.map(entry => entry.app)];
      this.selectedApparatusEntries$.next(newValue);
    }
    else {
      const entriesToKeep = selectedIds.filter(({ exponentId }) => !newIds.some(newEntry => newEntry.exponentId === exponentId));
      const newValue = [...entriesToKeep.map(entry => entry.app), ...entriesToAdd.map(entry => entry.app)];
      this.selectedApparatusEntries$.next(newValue);
    }
  }


  getDepaElements(exponent: ApparatusEntryExponent) {
    const from = exponent.from();
    const fromEl = document.getElementById(from.valueWithoutRef);
    const to = exponent.to();
    const toEl = document.getElementById(to.valueWithoutRef);
    return { fromEl, toEl };
  }
}


export interface TextHoverArgs {
  id: string;
  element: HTMLElement;
  isHovering: boolean;
}