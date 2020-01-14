import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NamedEntitiesList } from 'src/app/models/evt-models';

@Component({
  selector: 'evt-named-entities-list',
  templateUrl: './named-entities-list.component.html',
  styleUrls: ['./named-entities-list.component.scss'],
})
export class NamedEntitiesListComponent implements OnInit {
  @Input() list: NamedEntitiesList;
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

  ngOnInit() {
    if (!!this.list) {
      this.navigationKeys = this.list.content
        .map(el => el.id.substr(0, 1).toLowerCase())
        .filter((item, i, ar) => ar.indexOf(item) === i)
        .sort();
      this.selectedKey = this.navigationKeys[0];
    }
  }

  toggleSearch() {
    this.searchOpened = !this.searchOpened;
    this.querySearch = '';
    this.querySearchSubmitted = '';
    this.searchedEntities.emit(this.querySearch);
  }
}
