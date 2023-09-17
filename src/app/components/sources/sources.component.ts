import { Component, Input, OnInit } from '@angular/core';
import { EVTStatusService } from 'src/app/services/evt-status.service';
import { SourceClass } from '../../models/evt-models';
import { BehaviorSubject } from 'rxjs';
import { EditionLevelType } from 'src/app/app.config';

@Component({
  selector: 'evt-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss'],
})
export class SourcesComponent implements OnInit {

  private edLevel: EditionLevelType;

  public entries;
  private appClasses = [SourceClass];

  public quotesInCurrentPage = this.evtStatusService.getPageElementsByClassList(this.appClasses)

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
    this.entries = data.flat();
  }

  constructor(
    public evtStatusService: EVTStatusService,
  ) {}

  ngOnInit() {
    this.quotesInCurrentPage.subscribe({ next: (data) => { this.getEntries(data) } });
  }

}
