import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EVTStatusService } from 'src/app/services/evt-status.service';
import { QuoteEntry, SourceClass } from '../../models/evt-models';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { EditionLevelType } from 'src/app/app.config';

@Component({
  selector: 'evt-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourcesComponent {
  @Input() pageID: string;

  @Input() set editionLevel(el: EditionLevelType) {
    this.edLevel = el;
    this.editionLevelChange.next(el);
  }
  get editionLevel() { return this.edLevel; }
  editionLevelChange = new BehaviorSubject<EditionLevelType | ''>('');
  private edLevel: EditionLevelType;

  private appClasses = [SourceClass];
  public quotesInCurrentPage = this.evtStatusService.getPageElementsByClassList(this.appClasses)
  public sources$: Observable<QuoteEntry[]> = this.quotesInCurrentPage.pipe(
    map(data => data.flat())
  )

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  constructor(
    public evtStatusService: EVTStatusService,
  ) { }
}
