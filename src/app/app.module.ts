import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
];

import { ThemesService } from './services/themes.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  providers: [
    ThemesService,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
}
