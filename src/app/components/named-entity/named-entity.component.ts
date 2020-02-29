import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
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

  @ViewChild('entityDetails') entityDetails: NgbNav;

  public contentOpened = true;

  get selectedSection() {
    if (this.contentOpened) {
      return `${this.data && this.data.content.length === 0 ? 'occurrences' : 'info'}_${this.data.id}`;
    }

    return '';
  }

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
