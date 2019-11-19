import { Component, OnInit, Input, Output, EventEmitter, Attribute } from '@angular/core';

@Component({
  selector: 'evt-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() toggler: boolean;
  @Input() transparent: boolean;
  @Input() active: boolean;
  @Input() additionalStyle: { [key: string]: string | number };
  @Input() disabled: boolean;
  @Input() label: string;
  @Output() btnClick: EventEmitter<EVTBtnClickEvent> = new EventEmitter();

  constructor(
    @Attribute('type') public type: string,
    @Attribute('additionalClasses') public additionalClasses: string
  ) { }

  ngOnInit() {
    this.active = this.active !== undefined ? this.active : false;
    this.disabled = this.disabled !== undefined ? this.disabled : false;
    this.type = this.type || 'button';
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
