import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EvtIconInfo } from '../icon/icon.component';

@Component({
  selector: 'evt-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit, OnChanges {
  @Input() public iconLeft: EvtIconInfo;
  @Input() public iconRight: EvtIconInfo;
  @Input() toggler: boolean;
  @Input() transparent: boolean;
  @Input() inverted: boolean;
  @Input() active: boolean;
  @Input() additionalStyle: { [key: string]: string | number };
  @Input() disabled: boolean;
  @Input() label: string;
  @Input() additionalClasses: string;
  @Input() type: 'button' | 'submit';
  @Output() btnClick: EventEmitter<EVTBtnClickEvent> = new EventEmitter();

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.active = this.active !== undefined ? this.active : false;
    this.disabled = this.disabled !== undefined ? this.disabled : false;
    if (this.iconLeft) {
      this.iconLeft = {
        ...this.iconLeft,
        additionalClasses: 'icon ' + (this.iconLeft.additionalClasses || ''),
      };
    }
    if (this.iconRight) {
      this.iconRight = {
        ...this.iconRight,
        additionalClasses: 'icon ' + (this.iconRight.additionalClasses || ''),
      };
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.active) {
      this.active = changes.active.currentValue;
      this.cdRef.detectChanges();
    }
  }

  clickButton(event: MouseEvent) {
    if (!this.disabled) {
      if (this.toggler) {
        this.active = !this.active;
      }
      this.btnClick.emit({ event, active: this.active });
    }
  }
}

export interface EVTBtnClickEvent {
  event: MouseEvent;
  active?: boolean;
}
