/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit } from '@angular/core';
import { EVTModelService } from '../../services/evt-model.service';
import { EVTStatusService } from '../../services/evt-status.service';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'evt-critical-apparatus',
  templateUrl: './critical-apparatus.component.html',
  styleUrls: ['./critical-apparatus.component.scss'],
})
export class CriticalApparatusComponent implements OnInit {

  @Input() pageID : string;

  public entries;
  private appClasses = ['app'];

  public currentPage = this.evtStatusService.currentStatus$.pipe(
    map(({ page }) => page.parsedContent),
    map((x) => x.map((y) => y['content']).filter((y) => y)));

  public apparatusInCurrentPage = this.currentPage.pipe(
    map((x) => x.map((y) => y.map((z) => this.appClasses.includes(z.class) ? z : null).filter((z) => z))),
    filter((x) => x.length !== 0),
  );

  public getEntries(data: any) {
    this.entries = data.flat();
  }

  constructor(
    public evtModelService: EVTModelService,
    public evtStatusService: EVTStatusService,
  ) {}

  ngOnInit() {
    this.apparatusInCurrentPage.subscribe({ next: (data:any) => { this.getEntries(data) } });
  }

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

}
