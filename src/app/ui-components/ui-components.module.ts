import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { DynamicModule } from 'ng-dynamic-component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
    NgbModule,
  ],
  exports: [
    ButtonComponent,
    IconComponent,
    PanelComponent,
    DropdownComponent,
    ModalComponent
  ],
  entryComponents: [
    ModalComponent
  ]
})
export class UiComponentsModule { }
