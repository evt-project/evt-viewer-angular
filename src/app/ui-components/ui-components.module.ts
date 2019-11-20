import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { DynamicModule } from 'ng-dynamic-component';

import { ButtonComponent } from './button/button.component';
import { IconComponent } from './icon/icon.component';
import { PanelComponent } from './panel/panel.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { AppTranslationModule } from '../app-translation.module';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [
    ButtonComponent,
    IconComponent,
    PanelComponent,
    DropdownComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    AppTranslationModule,
    DynamicModule.withComponents([]),
  ],
  exports: [
    ButtonComponent,
    IconComponent,
    PanelComponent,
    DropdownComponent,
    ModalComponent
  ]
})
export class UiComponentsModule { }
