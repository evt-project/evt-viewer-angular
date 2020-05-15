import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { map, shareReplay } from 'rxjs/operators';

import { NamedEntity } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EVTModelService } from '../../services/evt-model.service';

@register(NamedEntity)
@Component({
  selector: 'evt-named-entity',
  templateUrl: './named-entity.component.html',
  styleUrls: ['./named-entity.component.scss'],
})
export class NamedEntityComponent implements OnInit {
  @Input() data: NamedEntity;
  @Input() inList: boolean;
  occurrences$ = this.evtModelService.entitiesOccurrences$.pipe(
    map(occ => occ[this.data.id] || []),
    shareReplay(1),
  );
  relations$ = this.evtModelService.relations$.pipe(
    map(el => el.filter(rel => rel.activeParts.indexOf(this.data.id) >= 0 ||
      rel.passiveParts.indexOf(this.data.id) >= 0 || rel.mutualParts.indexOf(this.data.id) >= 0)));

  @ViewChild('entityDetails') entityDetails: NgbNav;

  public contentOpened = true;

  get selectedSection() {
    if (this.contentOpened) {
      return `${this.data && this.data.content.length === 0 ? 'occurrences' : 'info'}_${this.data.id}`;
    }

    return '';
  }

  constructor(
    private evtModelService: EVTModelService,
  ) {
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
