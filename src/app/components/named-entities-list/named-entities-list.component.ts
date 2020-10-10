import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NamedEntitiesList } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EVTBtnClickEvent } from '../../ui-components/button/button.component';

@register(NamedEntitiesList)
@Component({
  selector: 'evt-named-entities-list',
  templateUrl: './named-entities-list.component.html',
  styleUrls: ['./named-entities-list.component.scss'],
})
export class NamedEntitiesListComponent implements OnInit, OnChanges {
  @Input() data: NamedEntitiesList;
  @Output() searchedEntities: EventEmitter<string> = new EventEmitter();
  // tslint:disable-next-line: variable-name
  private _selectedKey: string;
  set selectedKey(k: string) {
    this._selectedKey = k;
  }
  get selectedKey() { return this._selectedKey; }
  public navigationKeys: string[] = [];

  public searchOpened = false;
  public querySearch = '';
  public querySearchSubmitted = '';
  public caseSensitiveSearch = false;

  ngOnInit() {
    this.initKeys();
  }

  ngOnChanges() {
    this.initKeys();
  }

  toggleSearch() {
    this.searchOpened = !this.searchOpened;
    this.querySearch = '';
    this.querySearchSubmitted = '';
    this.searchedEntities.emit(this.querySearch);
  }

  toggleCaseSensitiveSearch(event: EVTBtnClickEvent) {
    this.caseSensitiveSearch = event.active;
  }

  private initKeys() {
    if (!!this.data && !!this.data.content && this.data.content.length > 0) {
      this.navigationKeys = this.data.content
        .filter(el => el.namedEntityType === this.data.namedEntityType)
        .map(el => el.sortKey?.substr(0, 1).toLowerCase())
        .filter((item, i, ar) => item && ar.indexOf(item) === i)
        .sort();
      this.selectedKey = this.navigationKeys[0] || '';
    }
  }
}
