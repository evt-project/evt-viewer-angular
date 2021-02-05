import { Component, Input, Output } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { EVTModelService } from '../../services/evt-model.service';

@Component({
  selector: 'evt-page-selector',
  templateUrl: './page-selector.component.html',
  styleUrls: ['./page-selector.component.scss'],
})
export class PageSelectorComponent {
  public pages$ = this.evtModelService.pages$;
  selectedPage$ = new BehaviorSubject<string>(undefined);

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  private inner_pageID: string;
  @Input() set pageID(p: string) {
    this.inner_pageID = p;
    this.selectedPage$.next(this.inner_pageID);
  }
  get pageID() { return this.inner_pageID; }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Output() selectionChange = combineLatest([
    this.pages$,
    this.selectedPage$.pipe(distinctUntilChanged()),
  ]).pipe(
    filter(([pages, pageID]) => !!pageID && !!pages && pages.length > 0),
    map(([pages, pageID]) => pages.find(p => p.id === pageID)),
  );

  constructor(
    private evtModelService: EVTModelService,
  ) {
  }

}
