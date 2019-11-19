import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ButtonComponent } from './button/button.component';
import { IconComponent } from './icon/icon.component';
import { PanelComponent } from './panel/panel.component';
@NgModule({
  declarations: [
    ButtonComponent,
    IconComponent,
    PanelComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    ButtonComponent,
    IconComponent,
    PanelComponent
  ]
})
export class UiComponentsModule { }
