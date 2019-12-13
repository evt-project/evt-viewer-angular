import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DynamicModule } from 'ng-dynamic-component';

import { AppTranslationModule } from '../app-translation.module';
import { ButtonComponent } from './button/button.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { EscapeDirective } from './directives/escape.directive';
import { IconComponent } from './icon/icon.component';
import { ModalComponent } from './modal/modal.component';
import { PanelComponent } from './panel/panel.component';

@NgModule({
  declarations: [
    ButtonComponent,
    IconComponent,
    PanelComponent,
    ModalComponent,
    ClickOutsideDirective,
    EscapeDirective,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    AppTranslationModule,
    DynamicModule.withComponents([]),
    NgbModule,
    NgSelectModule,
  ],
  exports: [
    ButtonComponent,
    IconComponent,
    PanelComponent,
    ModalComponent,
    ClickOutsideDirective,
    EscapeDirective,
    NgSelectModule,
  ],
  entryComponents: [
    ModalComponent,
  ],
})
export class UiComponentsModule {
}
