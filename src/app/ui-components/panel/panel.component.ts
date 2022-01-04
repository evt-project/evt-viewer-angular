import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'evt-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit {
  @Input() comparable: boolean;
  @Input() secondary: boolean;
  @Input() closable: boolean;
  @Input() hideHeader: boolean;
  @Input() hideFooter: boolean;
  @Input() showSecondaryContent: boolean;

  @Output() hide: EventEmitter<boolean> = new EventEmitter();
  @Output() scrollContent: EventEmitter<MouseEvent> = new EventEmitter();

  ngOnInit() {
    this.comparable = this.comparable === undefined ? false : this.comparable;
    this.secondary = this.secondary === undefined ? false : this.secondary;
    this.closable = this.closable === undefined ? false : this.closable;
    this.hideHeader = this.hideHeader === undefined ? false : this.hideHeader;
    this.hideFooter = this.hideFooter === undefined ? false : this.hideFooter;
    this.showSecondaryContent = this.showSecondaryContent === undefined ? false : this.showSecondaryContent;
  }

  isSecondaryContentOpened(): boolean {
    return this.showSecondaryContent;
  }

  emitHide() {
    this.hide.emit(true);
  }

  onScroll(event: MouseEvent) {
    event.preventDefault();
    this.scrollContent.emit(event);
  }
}
