import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { NamedEntity } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@register
@Component({
  selector: 'evt-named-entity',
  templateUrl: './named-entity.component.html',
  styleUrls: ['./named-entity.component.scss'],
})
export class NamedEntityComponent implements OnInit {
  @Input() data: NamedEntity;
  @Input() inList: boolean;

  @ViewChild('entityDetails', { static: false }) entityDetails: NgbTabset;
  public contentOpened = true;

  ngOnInit() {
    if (this.inList) {
      this.contentOpened = false;
    }
  }

  toggleContent() {
    if (this.inList) {
      this.contentOpened = !this.contentOpened;
      if (this.contentOpened) {
        if (this.entityDetails.activeId === 'info' && this.entity.content.length === 0) {
          this.entityDetails.select('occurrences');
        }
      }
    }
  }

  tabSelected(event: MouseEvent) {
    event.stopPropagation();
  }

}
