import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'evt-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  @Input() iconInfo: EvtIconInfo;

  ngOnInit(): void {
    if (this.iconInfo) {
      this.iconInfo.iconSet = this.iconInfo.iconSet ? this.iconInfo.iconSet : 'fas'; // Default set is Fontawesome Solid
      this.iconInfo.additionalClasses = this.iconInfo.additionalClasses || '';
      this.iconInfo.rotate = this.iconInfo.rotate !== undefined ? this.iconInfo.rotate : 0;
    }
  }
}
export interface EvtIconInfo {
  icon: string;
  iconSet?: 'evt' | 'fas' | 'far';
  additionalClasses?: string;
  rotate?: number;
  transform?: string;
  mask?;
}
