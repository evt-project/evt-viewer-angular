/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit } from '@angular/core';
import { EVTStatusService } from '../../services/evt-status.service';
import { ApparatusEntry } from 'src/app/models/evt-models';

@Component({
  selector: 'evt-critical-apparatus',
  templateUrl: './critical-apparatus.component.html',
  styleUrls: ['./critical-apparatus.component.scss'],
})
export class CriticalApparatusComponent implements OnInit {
  public entries: ApparatusEntry;
  private appClasses = ['app'];
  public apparatusInCurrentPage = this.evtStatusService.getPageElementsByClassList(this.appClasses)

  @Input() pageID : string;

  public getEntries(data) {
    this.entries = data.flat();
  }

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  constructor(
    public evtStatusService: EVTStatusService,
  ) {}

  ngOnInit() {
    this.apparatusInCurrentPage.subscribe({ next: (data) => { this.getEntries(data) } });
  }

}
