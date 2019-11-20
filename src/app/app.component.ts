import { Component, OnInit, HostBinding, OnDestroy, HostListener } from '@angular/core';
import { ThemesService } from './services/themes.service';
import { Subscription } from 'rxjs';
import { ShortcutsService } from './shortcuts/shortcuts.service';

@Component({
  selector: 'evt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(
    private shortcutsService: ShortcutsService,
    private themes: ThemesService,
  ) { }

  @HostBinding('attr.data-theme') get dataTheme() { return this.themes.getCurrentTheme().value; }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(e: KeyboardEvent) {
    this.shortcutsService.handleKeyboardEvent(e);
  }
}
