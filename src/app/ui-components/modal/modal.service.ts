import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private openedModals: { [modalId: string]: NgbModalRef } = {};
  constructor(private ngbModal: NgbModal) { }

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
}

export interface ModalOptions extends NgbModalOptions {
  id?: string;
}
