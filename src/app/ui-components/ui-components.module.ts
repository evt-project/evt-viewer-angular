import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ButtonComponent } from './button/button.component';
import { IconComponent } from './icon/icon.component';
@NgModule({
  declarations: [
    ButtonComponent,
    IconComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    ButtonComponent,
    IconComponent
  ]
})
export class UiComponentsModule { }
