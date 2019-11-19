import { Component } from '@angular/core';
import { ThemesService, ColorTheme } from './services/themes.service';

@Component({
  selector: 'evt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public themes: ThemesService) { }

  // TEMP
  selectTheme(theme: ColorTheme) {
    console.log('selectTheme', theme);
    this.themes.selectTheme(theme);
  }

  getAvailableThemes(): ColorTheme[] {
    return this.themes.getAvailableThemes();
  }

  getCurrentTheme(): string {
    return this.themes.getCurrentTheme().value;
  }
}
