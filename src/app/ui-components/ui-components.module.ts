import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ButtonComponent } from './button/button.component';
import { IconComponent } from './icon/icon.component';
import { PanelComponent } from './panel/panel.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { AppTranslationModule } from '../app-translation.module';

@NgModule({
  declarations: [
    ButtonComponent,
    IconComponent,
    PanelComponent,
    DropdownComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    AppTranslationModule
  ],
  exports: [
    ButtonComponent,
    IconComponent,
    PanelComponent,
    DropdownComponent
  ]
})
export class UiComponentsModule { }
