import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EvtIconInfo } from 'src/app/ui-components/icon/icon.component';

@Component({
  selector: 'evt-modal-witness-item',
  templateUrl: './modal-witness-item.component.html',
  styleUrls: ['./modal-witness-item.component.scss']
})
export class ModalWitnessItemComponent {
  @Input() witness: ModalWitnessItem;
  @Output() onSelect = new EventEmitter<string>();
  @Output() onRemove = new EventEmitter<string>();

  chevronIcon: EvtIconInfo = {iconSet: 'fas', icon: 'chevron-right'}
  isCollapsed = true;
  collapseId = 'ngbCollapse-1'
  
  constructor() { }
  
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.chevronIcon = {
      ...this.chevronIcon,
      icon: this.isCollapsed ? 'chevron-right' : 'chevron-down'
    };
  }
  
  onSelectClicked(witnessId: string) {
    this.onSelect.emit(witnessId);
  }
  
  onRemoveClicked(witnessId: string) {
    this.onRemove.emit(witnessId);
  }
  
  childrenWitnessesTrackBy(_, item: ModalWitnessItem) {
    return item.id;
  }
}

export interface ModalWitnessItem {
  id: string;
  label: string;
  canSelect: boolean;
  witnesses: ModalWitnessItem[]
}