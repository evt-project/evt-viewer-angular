import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'src/app/ui-components/modal/modal.service';

@Component({
  selector: 'evt-witness-resp-metadata',
  templateUrl: './witness-resp-metadata.component.html',
  styleUrls: ['./witness-resp-metadata.component.scss']
})
export class WitnessRespMetadataComponent implements OnInit {

  @Input() ids: string;

  itemIds: string[] = []

  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    if (!this.ids) return;

    if (this.ids.includes(' ')) {
      this.itemIds = this.ids.split(' ');
    }
    else {
      this.itemIds = [this.ids];
    }

    this.itemIds = this.itemIds.map(item => {
      if (item.startsWith('#')) {
        item = item.substring(1);
      }
      return item;
    });
  }

  onItemClicked(id: string) {
    this.modalService.openGlobalLists(id);
  }
}
