import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Language } from 'angular-l10n';

@Component({
  selector: 'evt-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  @Language() lang: string;
  @Input() selectedItems: DropdownItem[];
  @Input() items: DropdownItem[];
  @Input() multiSelection: boolean;
  @Input() customLabel: boolean;
  @Input() placeholder: string;
  @Input() alignRight: boolean;
  @Output() selectionChange: EventEmitter<DropdownItem[]> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.items = this.items ? this.items : [];
    this.selectedItems = this.selectedItems ? this.selectedItems : [];
    this.placeholder = this.placeholder ? this.placeholder : 'Select';
  }

  getItems() {
    if (this.multiSelection) {
      if (!this.items.find(item => item.id === 'all')) {
        this.items.push({
          id: 'all',
          label: 'SelectAll'
        });
      }
      if (!this.items.find(item => item.id === 'none')) {
        this.items.push({
          id: 'none',
          label: 'ClearSelection'
        });
      }
    }
    return this.items;
  }

  toggleItem(item) {
    setTimeout(() => { // Needed to let bootstrap close the list of selectable items
      let selectedItems = [].concat(this.selectedItems);
      if (item.id === 'all') {
        selectedItems = [].concat(this.items);
        selectedItems.pop(); // Remove 'Select all'
        selectedItems.pop(); // Remove 'Clear'
      } else if (item.id === 'none') {
        selectedItems = [];
      } else if (this.multiSelection) {
        const currentItemIndex = selectedItems.findIndex(selectedItem => selectedItem.id === item.id);
        if (currentItemIndex >= 0) { // Unselect
          selectedItems.splice(currentItemIndex, 1);
        } else { // Select
          selectedItems.push(item);
        }
      } else { // Single selector must will have one item selected per time
        selectedItems = [item];
      }
      this.selectedItems = selectedItems;
      this.selectionChange.emit(this.selectedItems);
    });
  }

  isActiveItem(item) {
    return this.selectedItems && this.selectedItems.find(selectedItem => selectedItem.id === item.id);
  }

  getSelectedLabel() {
    if (this.selectedItems && this.selectedItems.length > 0) {
      // sadads
      if (this.multiSelection) {
        if (this.selectedItems.length === 1) {
          return this.selectedItems[0] ? this.selectedItems[0].label : '';
        } else {
          return 'NSelectedItems'; // Key of label in translations
        }
      } else {
        return this.selectedItems[0] ? this.selectedItems[0].label : '';
      }
      // asdadas
    } else {
      return this.placeholder;
    }
  }
}

export interface DropdownItem {
  id: any;
  label: string;
  title?: string;
}
