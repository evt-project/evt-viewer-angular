/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit } from '@angular/core';
import { EVTStatusService } from '../../services/evt-status.service';

@Component({
  selector: 'evt-critical-apparatus',
  templateUrl: './critical-apparatus.component.html',
  styleUrls: ['./critical-apparatus.component.scss'],
})
export class CriticalApparatusComponent implements OnInit {

  @Input() pageID : string;

  public entries;
  private appClasses = ['app'];

  public apparatusInCurrentPage = this.evtStatusService.getPageElementsByClassList(this.appClasses)

  public getEntries(data: any) {
    this.entries = data.flat();
  }

  constructor(
    public evtStatusService: EVTStatusService,
  ) {}

  ngOnInit() {
    this.apparatusInCurrentPage.subscribe({ next: (data:any) => { this.getEntries(data) } });
  }

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

}
