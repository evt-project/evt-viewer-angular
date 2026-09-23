/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';
import { EVTStatusService } from '../../services/evt-status.service';
import { BehaviorSubject, combineLatest, map, Observable, tap } from 'rxjs';
import { ApparatusEntry } from 'src/app/models/evt-models';
import { HoverService } from 'src/app/services/hover.service';
import { distinctBy } from 'src/app/utils/js-utils';
import { EditionLevelType } from 'src/app/app.config';

@Component({
  selector: 'evt-critical-apparatus',
  templateUrl: './critical-apparatus.component.html',
  styleUrls: ['./critical-apparatus.component.scss'],
})
export class CriticalApparatusComponent {
  @Input() pageID: string;
  @Input() set editionLevel(el: EditionLevelType) {
    this.edLevel = el;
    this.editionLevelChange.next(el);
  }
  get editionLevel() { return this.edLevel; }
  editionLevelChange = new BehaviorSubject<EditionLevelType | ''>('');
  private edLevel: EditionLevelType;
    
  @ViewChildren('appDetails', { read: ElementRef }) appDetails!: QueryList<ElementRef>;

  private appClasses = ['app'];
  private apparatusInCurrentPage = this.evtStatusService.getPageElementsByClassList(this.appClasses)
  entries$: Observable<{ entry: ApparatusEntry, isSelected: boolean }[]> = combineLatest([
    this.apparatusInCurrentPage.pipe(
      map(data => data.flat()),
      map(data => distinctBy(data, item => item.id))
    ),
    this.hoverService.selectedApparatusEntries$
  ]).pipe(
    map(([appEntries, selectedAppEntries]) => {
      const apparatusEntries = appEntries as ApparatusEntry[];
      const apps = apparatusEntries
        .map(entry => {
          const selectedApp = selectedAppEntries.find(app => app.additionalAttributes.exponentId === entry.additionalAttributes.exponentId);
          return { entry, isSelected: !!selectedApp };
        });
      const orderedApps = apps.sort((a, b) => {
        const lengthComparison = a.entry.exponent.length - b.entry.exponent.length;
        if (lengthComparison !== 0) {
          return lengthComparison;
        }
        return a.entry.exponent.localeCompare(b.entry.exponent);
      });
      return orderedApps;
    }),
    tap(result => {
      const selectedIndex = result.findIndex(x => x.isSelected);
      if (selectedIndex >= 0) {
        const ref = this.appDetails.toArray()[selectedIndex];
        ref?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    })
  );

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  constructor(
    private evtStatusService: EVTStatusService,
    private hoverService: HoverService,
  ) {
  }

  selectApparatusEntry(app: ApparatusEntry) {
    this.hoverService.selectApparatusEntry([app]);
  }
}
