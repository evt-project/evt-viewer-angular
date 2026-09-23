import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { EditionLevelType } from 'src/app/app.config';
import { Analogue, AnalogueClass } from 'src/app/models/evt-models';
import { EVTStatusService } from 'src/app/services/evt-status.service';

@Component({
  selector: 'evt-analogues',
  templateUrl: './analogues.component.html',
  styleUrls: ['./analogues.component.scss', '../sources/sources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnaloguesComponent {
  @Input() pageID: string;
  @Input() set editionLevel(el: EditionLevelType) {
    this.edLevel = el;
    this.editionLevelChange.next(el);
  }
  get editionLevel() { return this.edLevel; }
  editionLevelChange = new BehaviorSubject<EditionLevelType | ''>('');
  private edLevel: EditionLevelType;

  private appClasses = [AnalogueClass];
  public analoguesInCurrentPage = this.evtStatusService.getPageElementsByClassList(this.appClasses)
  public analogues$: Observable<Analogue[]> = this.analoguesInCurrentPage.pipe(
    map(data => data.flat())
  );

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  constructor(
    public evtStatusService: EVTStatusService,
  ) { }
}

