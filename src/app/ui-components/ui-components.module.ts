import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DynamicAttributesModule, DynamicModule } from 'ng-dynamic-component';

import { AppTranslationModule } from '../app-translation.module';
import { ButtonComponent } from './button/button.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { EscapeDirective } from './directives/escape.directive';
import { HeaderSectionComponent } from './header-section/header-section.component';
import { IconComponent } from './icon/icon.component';
import { ModalComponent } from './modal/modal.component';
import { PanelComponent } from './panel/panel.component';

@NgModule({
  declarations: [
    ButtonComponent,
    ClickOutsideDirective,
    EscapeDirective,
    HeaderSectionComponent,
    IconComponent,
    ModalComponent,
    PanelComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    AppTranslationModule,
    DynamicAttributesModule,
    DynamicModule,
    NgbModule,
    NgSelectModule,
  ],
  exports: [
    ButtonComponent,
    ClickOutsideDirective,
    EscapeDirective,
    HeaderSectionComponent,
    IconComponent,
    ModalComponent,
    NgSelectModule,
    PanelComponent,
  ],
  entryComponents: [
    ModalComponent,
  ],
})
export class UiComponentsModule {
}
