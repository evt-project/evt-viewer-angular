import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { PinboardService } from './pinboard.service';

@Component({
  selector: 'evt-pinboard',
  templateUrl: './pinboard.component.html',
  styleUrls: ['./pinboard.component.scss'],
})
export class PinboardComponent implements OnInit, OnChanges {
  @Input() types: string[];
  // tslint:disable-next-line: no-any
  itemsPinned$: Observable<any[]>; // TODO: get rid of any

  constructor(private pinboard: PinboardService) {
  }

  ngOnInit() {
    this.initPins();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.types.currentValue !== changes.types.previousValue) {
      this.initPins();
    }
  }

  removePinnedItem(item) {
    this.pinboard.toggleItem(item);
  }

  private initPins() {
    this.itemsPinned$ = this.pinboard.getItems(this.types);
  }
}
