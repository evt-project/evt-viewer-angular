import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemesService {
    themes: ColorTheme[];
    currentTheme: ColorTheme;

    constructor() {
        this.themes = [{
            value: 'neutral',
            label: 'Neutral'
        }, {
            value: 'blue',
            label: 'Blue'
        }, {
            value: 'brown',
            label: 'Brown'
        }];
        this.currentTheme = this.themes[0];
    }

    selectTheme(theme: ColorTheme) {
        this.currentTheme = theme;
    }

    getAvailableThemes(): ColorTheme[] {
        return this.themes;
    }

    getCurrentTheme(): ColorTheme {
        return this.currentTheme;
    }
}

export interface ColorTheme {
  value: string;
  label: string;
}
