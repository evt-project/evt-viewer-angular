import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { map } from 'rxjs/operators';
import { GridItem, Page } from '../../models/evt-models';
import { EVTStatusService } from '../../services/evt-status.service';

@Component({
  selector: 'evt-manuscript-thumbnails',
  templateUrl: './manuscript-thumbnails-viewer.component.html',
  styleUrls: ['./manuscript-thumbnails-viewer.component.scss'],
})

export class ManuscriptThumbnailsViewerComponent implements OnInit, OnChanges {
  @Output() clickedItem = new EventEmitter<GridItem>();

  @Input() pages: Page[] = [];
  @Input() col = 1;
  @Input() row = 1;

  public indexPage = 0;
  private items: GridItem[];
  public grid: GridItem[][][] = [];

  public currentItem$ = this.evtStatusService.currentPage$.pipe(
    map(p => this.items.find(i => i.id === p.id)),
  );

  constructor(
    private evtStatusService: EVTStatusService,
  ) {
  }

  ngOnInit() {
    this._setup();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (Object.keys(changes).some(k => changes[k].currentValue !== changes[k].previousValue)) {
      this._setup();
    }
  }

  private _setup() {
    this.items = this.pages.map((page) => ({ url: page.url, name: page.label, id: page.id }));
    this.col = this.isValid(this.col) ? this.col : 1;
    this.row = this.isValid(this.row) ? this.row : 1;
    const gridSize = this.col * this.row;
    this.grid = Array(Math.ceil(this.items.length / gridSize)).fill(1)
      .map((_, i) => this.items.slice(i * gridSize, i * gridSize + gridSize))
      .map((p) => Array(this.row).fill(1).map((_, i) => p.slice(i * this.col, i * this.col + this.col)))
      ;
  }

  isValid(value) {
    return !(isNaN(value) || value <= 0);
  }

  goToPrevPage() {
    this.indexPage = Math.max(0, this.indexPage - 1);
  }

  goToNextPage() {
    this.indexPage = Math.min(this.indexPage + 1, this.grid.length - 1);
  }

  goToThumbPage(item) {
    this.evtStatusService.updatePage$.next(this.pages.find(p => p.id === item.id));
    this.clickedItem.emit(item);
  }
}
