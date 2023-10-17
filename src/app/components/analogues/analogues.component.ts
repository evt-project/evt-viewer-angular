import { Component, Input, OnInit } from '@angular/core';
import { EVTStatusService } from 'src/app/services/evt-status.service';

@Component({
  selector: 'evt-analogues',
  templateUrl: './analogues.component.html',
  styleUrls: ['./analogues.component.scss','../sources/sources.component.scss'],
})
export class AnaloguesComponent implements OnInit {

  @Input() pageID : string;

  public analogues;
  private appClasses = ['analogueEntry'];

  public analoguesInCurrentPage = this.evtStatusService.getPageElementsByClassList(this.appClasses)

  public getEntries(data) {
    this.analogues = data.flat();
  }

  constructor(
    public evtStatusService: EVTStatusService,
  ) {}

  ngOnInit() {
    this.analoguesInCurrentPage.subscribe({ next: (data) => { this.getEntries(data) } });
  }

}

