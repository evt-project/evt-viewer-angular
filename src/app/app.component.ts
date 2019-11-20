import { Component, HostBinding, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ThemesService } from './services/themes.service';
import { Subscription } from 'rxjs';
import { ShortcutsService } from './shortcuts/shortcuts.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'evt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  @ViewChild('mainSpinner', { static: false }) mainSpinner: ElementRef;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private shortcutsService: ShortcutsService,
    private themes: ThemesService,
  ) {
    this.router.events.subscribe((event) => {
      switch (true) {
          case event instanceof NavigationStart:
              this.spinner.show();
              break;
          case event instanceof NavigationEnd:
          case event instanceof NavigationCancel:
          case event instanceof NavigationError:
              this.spinner.hide();
              break;
          default:
              break;
      }
  });
  }

  @HostBinding('attr.data-theme') get dataTheme() { return this.themes.getCurrentTheme().value; }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(e: KeyboardEvent) {
    this.shortcutsService.handleKeyboardEvent(e);
  }
}
