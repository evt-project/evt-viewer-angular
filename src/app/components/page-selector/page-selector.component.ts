import { Component, HostListener, Input, Output } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, take } from 'rxjs/operators';

import { EVTModelService } from '../../services/evt-model.service';
import { getEventKeyCode } from 'src/app/utils/js-utils';

@Component({
  selector: 'evt-page-selector',
  templateUrl: './page-selector.component.html',
  styleUrls: ['./page-selector.component.scss'],
})
export class PageSelectorComponent {
  public pages$ = this.evtModelService.pages$;

  // tslint:disable-next-line: variable-name
  private _pageID: string;
  @Input() set pageID(p: string) {
    this._pageID = p;
    this.selectedPage$.next(this._pageID);
  }
  get pageID() { return this._pageID; }

  selectedPage$ = new BehaviorSubject<string>(undefined);

  @Output() selectionChange = combineLatest([
    this.pages$,
    this.selectedPage$.pipe(distinctUntilChanged()),
  ]).pipe(
    filter(([pages, pageID]) => !!pageID && !!pages && pages.length > 0),
    map(([pages, pageID]) => pages.find((p) => p.id === pageID)),
  );

  @HostListener('window:keyup', ['$event'])
  keyEvent(e: KeyboardEvent) {
    this.pages$.pipe(take(1)).subscribe((pageList) => {
      const pageIndex = pageList.findIndex((pg) => (pg.id === this.selectedPage$.getValue()));
      if (pageIndex !== undefined) {
        switch (getEventKeyCode(e)) {
        case "ArrowLeft":
          if (pageList[pageIndex-1] !== undefined && pageList[pageIndex-1].id) {
            this.pageID = pageList[pageIndex-1].id;
          }
          break;
        case "ArrowRight":
          if (pageList[pageIndex+1] !== undefined && pageList[pageIndex+1].id) {
            this.pageID = pageList[pageIndex+1].id;
          }
          break;
        }
      }
    });
    // some views have more than one page-selector (es: text-image)
    e.stopImmediatePropagation();
  }

  constructor(
    private evtModelService: EVTModelService,
  ) {
  }

}
