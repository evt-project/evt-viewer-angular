import {
  Component, OnInit, Input, Output, EventEmitter, ElementRef,
  HostListener, ViewChild, Attribute, HostBinding
} from '@angular/core';

import { ThemesService } from '../../services/themes.service';
import { getEventKeyCode } from '../../utils/jsUtils';
import { EvtIconInfo } from '../icon/icon.component';
import { ModalService } from './modal.service';

@Component({
  selector: 'evt-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() closeOnShadow: boolean;
  @Input() closeOnEsc: boolean;
  @Input() fixedHeight: boolean;
  @Input() wider: boolean;
  @Input() headerIcon: EvtIconInfo;

  @Input() bodyComponent: any;
  @Input() footerComponent: any;

  @Input() bodyHTML: string;
  @Input() footerHTML: string;

  @Output() hide = new EventEmitter<string>();

  @ViewChild('modalDialog', { static: true }) modalDialog: ElementRef;

  @HostBinding('attr.data-theme') get dataTheme() { return this.themes.getCurrentTheme().value; }

  constructor(
    @Attribute('modalId') public modalId: string,
    @Attribute('title') public title: string,
    @Attribute('bodyContentClass') public bodyContentClass: string,
    public themes: ThemesService,
    private modalService: ModalService) {
  }

  ngOnInit() {
    this.closeOnShadow = this.closeOnShadow === undefined ? true : this.closeOnShadow;
    this.closeOnEsc = this.closeOnEsc === undefined ? true : this.closeOnEsc;
    this.fixedHeight = this.fixedHeight === undefined ? false : this.fixedHeight;
  }

  @HostListener('click', ['$event'])
  clickout(event) {
    const modal = this.modalDialog.nativeElement;
    const internalClick: boolean = event.path.find((o) => {
      return o.className && o.className.indexOf && o.className.indexOf(modal.className) >= 0;
    });
    if (this.closeOnShadow && !internalClick) {
      this.closeDialog();
    }
  }

  handleEscape() {
    if (this.closeOnEsc) {
      this.closeDialog();
    }
  }

  closeDialog() {
    this.hide.emit(this.modalId);
    this.modalService.close(this.modalId);
  }
}
