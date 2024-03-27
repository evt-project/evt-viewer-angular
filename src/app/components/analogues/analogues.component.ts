import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { EditionLevelType } from 'src/app/app.config';
import { AnalogueClass } from 'src/app/models/evt-models';
import { EVTStatusService } from 'src/app/services/evt-status.service';

@Component({
  selector: 'evt-analogues',
  templateUrl: './analogues.component.html',
  styleUrls: ['./analogues.component.scss','../sources/sources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnaloguesComponent implements OnInit {
  private edLevel: EditionLevelType;
  public analogues;
  private appClasses = [AnalogueClass];
  public analoguesInCurrentPage = this.evtStatusService.getPageElementsByClassList(this.appClasses)

  @Input() pageID : string;

  @Input() set editionLevel(el: EditionLevelType) {
    this.edLevel = el;
    this.editionLevelChange.next(el);
  }
  get editionLevel() { return this.edLevel; }
  editionLevelChange = new BehaviorSubject<EditionLevelType | ''>('');

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  public getEntries(data) {
    this.analogues = data.flat();
  }

  constructor(
    public evtStatusService: EVTStatusService,
  ) {}

  ngOnInit() {
    this.analoguesInCurrentPage.pipe(distinctUntilChanged()).subscribe({ next: (data) => { this.getEntries(data) } });
  }

}

