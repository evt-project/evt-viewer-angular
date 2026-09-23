import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SynopsisPageSelectionList, SynopsisPageSelection } from '../synopsis.models';

@Component({
  selector: 'evt-synopsis-page-selector',
  templateUrl: './synopsis-page-selector.component.html',
  styleUrls: ['./synopsis-page-selector.component.scss']
})
export class SynopsisPageSelector implements OnInit{
  @Input() pageList: SynopsisPageSelectionList;
  @Input() selectedPage: SynopsisPageSelection;
  @Output() onSelectionChanged = new EventEmitter<string>();

  constructor(
  ) {
  }

  ngOnInit(): void {
}
  
changePage(pageId: string): void {
    this.onSelectionChanged.emit(pageId);
  }
}
