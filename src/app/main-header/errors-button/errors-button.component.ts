import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsService, SourceError } from 'src/app/services/errors.service';
import { ModalService } from 'src/app/ui-components/modal/modal.service';

@Component({
  selector: 'evt-errors-button',
  templateUrl: './errors-button.component.html',
  styleUrls: ['./errors-button.component.scss']
})
export class ErrorsButtonComponent implements OnInit {
  @ViewChild('content', { static: true }) content!: TemplateRef<any>;
  private witnessModalRef: NgbModalRef = null;
  errors$ = this.errorService.errors$;
  isLoading$ = this.errorService.isLoading$;

  constructor(
    private modalService: ModalService,
    private errorService: ErrorsService,
  ) {
  }

  ngOnInit(): void {
  }

  openModal() {
    this.witnessModalRef = this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' })
  }

  closeModal() {
    this.modalService.close(this.witnessModalRef);
  }

  getIcon(errorsList: SourceError[]): string {
    if (!errorsList || errorsList.length === 0) {
      return 'check';
    }
    return errorsList.some(e => e.type === 'error') ? 'circle-exclamation' : 'triangle-exclamation';
  }

  getColor(errorsList: SourceError[]): string {
    if (!errorsList || errorsList.length === 0) {
      return 'white';
    }
    return errorsList.some(e => e.type === 'error') ? 'red' : 'rgb(255, 168, 54)';
  }

  getErrorColor(error: SourceError): string {
    return error.type === 'error' ? 'red' : 'rgb(255, 168, 54)';
  }

  getErrorIcon(error: SourceError): string {
    return error.type === 'error' ? 'circle-exclamation' : 'triangle-exclamation';
  }

  dismissAll() {
    this.errorService.dismissAll();
  }

  dismiss(error: SourceError) {
    this.errorService.dismiss(error);
  }
}
