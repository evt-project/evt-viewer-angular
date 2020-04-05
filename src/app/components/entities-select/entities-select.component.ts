import { Component, EventEmitter, Output } from '@angular/core';
import { AppConfig } from '../../app.config';
import { EvtIconInfo } from '../../ui-components/icon/icon.component';

export interface EntitiesSelectItemGroup {
  label: string;
  items: EntitiesSelectItem[];
  disabled?: boolean;
}
export interface EntitiesSelectItem {
  label: string;
  value: string; // This will be used to identify the items to be selected, by indicating tag name and attributes (for XML)
  color?: string;
  disabled?: boolean;
}

@Component({
  selector: 'evt-entities-select',
  templateUrl: './entities-select.component.html',
  styleUrls: ['./entities-select.component.scss'],
})
export class EntitiesSelectComponent {
  @Output() selectionChange: EventEmitter<EntitiesSelectItem[]> = new EventEmitter();

  entitiesTypes: Array<EntitiesSelectItem & { group: string }> = (AppConfig.evtSettings.edition.entitiesSelectItems || [])
    .filter(g => !g.disabled)
    .reduce((x, y) => [...x, ...y.items.filter(i => !i.disabled).map(i => ({ ...i, group: y.label }))], []);

  iconColor: EvtIconInfo = {
    icon: 'circle',
    iconSet: 'fas',
    additionalClasses: 'ml-2 mr-1',
  };

  public selectedTypes: EntitiesSelectItem[] = [];

  updateSelectedTypes(entitiesTypes: EntitiesSelectItem[]) {
    if (Array.isArray(entitiesTypes)) { // BUGFIX: There is a bug in ng-select change event and second time the parameter is an event
      this.selectionChange.emit(entitiesTypes);
    }
  }

  toggleSelection() {
    if (this.selectedTypes.length < this.entitiesTypes.length) {
      this.selectedTypes = this.entitiesTypes;
    } else {
      this.selectedTypes = [];
    }
    this.selectionChange.emit(this.selectedTypes);
  }
}
