import { Component, Input, OnInit } from '@angular/core';
import { NamedEntity } from '../../models/evt-models';

@Component({
  selector: 'evt-named-entity',
  templateUrl: './named-entity.component.html',
  styleUrls: ['./named-entity.component.scss'],
})
export class NamedEntityComponent implements OnInit {
  @Input() entity: NamedEntity;
  @Input() inList: boolean;
  public contentOpened = true;

  ngOnInit() {
    if (this.inList) {
      this.contentOpened = false;
    }
  }

  toggleContent() {
    if (this.inList) {
      this.contentOpened = !this.contentOpened;
    }
  }

  tabSelected(event: MouseEvent) {
    event.stopPropagation();
  }

}
