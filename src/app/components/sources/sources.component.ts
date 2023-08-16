import { Component, Input, OnInit } from '@angular/core';
import { EVTStatusService } from 'src/app/services/evt-status.service';

@Component({
  selector: 'evt-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss'],
})
export class SourcesComponent implements OnInit {

  @Input() pageID : string;

  public entries;
  private appClasses = ['quoteEntry'];

  public quotesInCurrentPage = this.evtStatusService.getPageElementsByClassList(this.appClasses)

  public getEntries(data) {
    this.entries = data.flat();
    console.log('quotes in this page',this.entries);
  }

  constructor(
    public evtStatusService: EVTStatusService,
  ) {}

  ngOnInit() {
    this.quotesInCurrentPage.subscribe({ next: (data) => { this.getEntries(data) } });
  }

}
