import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal.component';
import { GlobalListsComponent } from 'src/app/components/global-lists/global-lists.component';
import { SearchService } from 'src/app/services/search.service';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private openedModals: { [modalId: string]: NgbModalRef } = {};
  constructor(
    private ngbModal: NgbModal,
    private searchService: SearchService,
  ) { }

  open(componentToOpen, options?: ModalOptions): NgbModalRef {
    options = {
      ...options || {},
      keyboard: false,
    };
    const modalRef = this.ngbModal.open(componentToOpen, options);
    if (options && options.id) {
      this.openedModals[options.id] = modalRef;
    }

    return modalRef;
  }

  close(modalRef: NgbModalRef | string) {
    if (typeof modalRef === 'string') {
      this.openedModals[modalRef].close();
    } else {
      modalRef.close();
    }
  }

  openGlobalLists(searchQuery?: string) {
    const modalRef = this.open(ModalComponent, { id: 'global-lists' });
    const modalComp = modalRef.componentInstance as ModalComponent;
    modalComp.fixedHeight = true;
    modalComp.wider = true;
    modalComp.modalId = 'global-lists';
    modalComp.title = 'lists';
    modalComp.bodyContentClass = 'p-0 h-100';
    modalComp.headerIcon = { icon: 'clipboard-list', iconSet: 'fas', additionalClasses: 'me-3' };
    modalComp.bodyComponent = GlobalListsComponent;
    this.searchService.search(searchQuery);
  }
}

export interface ModalOptions extends NgbModalOptions {
  id?: string;
}
