import { Component, Input, OnInit } from '@angular/core';
import {GridItem} from '../../models/evt-models';

@Component({
  selector: 'evt-manuscript-thumbnails',
  templateUrl: './manuscript-thumbnails-viewer.component.html',
  styleUrls: ['./manuscript-thumbnails-viewer.component.scss'],
})

export class ManuscriptThumbnailsViewerComponent implements OnInit {

  @Input() urls = [];
  @Input() col = 1;
  @Input() row = 1;

  public indexPage = 0;
  private items: GridItem[];
  public grid:GridItem[][][] = [];

  ngOnInit() {
    this.items = this.urls.map((url, i) => ({ url, name: 'page_' + i, active: false }));
    this.col = this.isValid(this.col) ?  this.col : 1;
    this.row = this.isValid(this.row) ?  this.row : 1;
    const gridSize = this.col * this.row;
    this.grid = Array(Math.ceil(this.items.length / gridSize)).fill(1)
      .map((_, i) => this.items.slice(i * gridSize, i * gridSize + gridSize))
      .map((p) => Array(this.row).fill(1).map((_, i) => p.slice(i * this.col, i * this.col + this.col)))
      ;
  }

  isValid(value){
    return !(isNaN(value) || value <= 0);
  }

  goToPrevPage() {
    this.indexPage = Math.max(0, this.indexPage-1);
  }

  goToNextPage() {
    this.indexPage = Math.min(this.indexPage+1, this.grid.length -1);
  }

  clickedItem(item) {
    this.items.forEach(el => el.active = el === item);
  }
}
