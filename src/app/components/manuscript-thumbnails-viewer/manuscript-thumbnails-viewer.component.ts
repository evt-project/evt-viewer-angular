import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'evt-manuscript-thumbnails',
  templateUrl: './manuscript-thumbnails-viewer.component.html',
  styleUrls: ['./manuscript-thumbnails-viewer.component.scss'],
})

export class ManuscriptThumbnailsViewerComponent implements OnInit {
  public grid = [];
  public col = 2  ;
  public row = 3;
  public gridSize = this.col * this.row;
  public indexPage = 0;
  private items = [
    {
      url: 'https://evt-project.github.io/evt-demo/data/images/single/VB_fol_104v.jpg',
      name: '104v',
      active: false,
    },
    {
      url: 'https://evt-project.github.io/evt-demo/data/images/single/VB_fol_104v.jpg',
      name: '105v',
      active: false,
    },
    {
      url: 'https://evt-project.github.io/evt-demo/data/images/single/VB_fol_104v.jpg',
      name: '106v',
      active: false,
    },
    {
      url: 'https://evt-project.github.io/evt-demo/data/images/single/VB_fol_104v.jpg',
      name: '107v',
      active: false,
    },
    {
      url: 'https://evt-project.github.io/evt-demo/data/images/single/VB_fol_104v.jpg',
      name: '108v',
      active: false,
    },
    {
      url: 'https://evt-project.github.io/evt-demo/data/images/single/VB_fol_104v.jpg',
      name: '109v',
      active: false,
    },
    {
      url: 'https://evt-project.github.io/evt-demo/data/images/single/VB_fol_104v.jpg',
      name: '110v',
      active: false,
    },
    {
      url: 'https://evt-project.github.io/evt-demo/data/images/single/VB_fol_104v.jpg',
      name: '111v',
      active: false,
    },
  ];

  ngOnInit() {

    if (this.col === 0 || this. row === 0) {
      this.grid = this.items;
    } else {
      let index = 0;
      let page = [];
      this.items.forEach(el => {
        index += 1;
        if (index > this.gridSize) {
          this.grid.push(this.chunkArray(page));
          page = [];
          index = 1;
        }
        page.push(el);
      });
      this.grid.push(this.chunkArray(page));
    }
  }

  chunkArray(page) {
    const chunks = [];
    let rowIndex = 0;
    let chunkIndex = 0;
    while (this.row !== rowIndex) {
      chunks.push(page.slice(chunkIndex, chunkIndex + this.col));
      chunkIndex += this.col;
      rowIndex += 1;
    }

    return chunks;
  }

  prewPage() {
    this.indexPage -= 1;
    if (this.indexPage < 0) {
      this.indexPage = 0;
    }
  }
  nextPage() {
    this.indexPage += 1;
    if (this.indexPage > this.grid.length - 1) {
      this.indexPage = this.grid.length - 1;
    }
  }

  selectedItem(item, url) {
    this.items.map(el => el.active = false);
    item.active = true;

    return(url);
  }
}
