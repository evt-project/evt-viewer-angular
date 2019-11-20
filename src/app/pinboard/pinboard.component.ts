import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PinboardService } from './pinboard.service';
import { Observable } from 'rxjs';
import { register } from '../services/component-register.service';

@Component({
  selector: 'evt-pinboard',
  templateUrl: './pinboard.component.html',
  styleUrls: ['./pinboard.component.scss']
})
@register
export class PinboardComponent implements OnInit, OnChanges {
  @Input() types: string[];
  itemsPinned$: Observable<any[]>;

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
