import { Component, ElementRef, HostBinding, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ThemesService } from './services/themes.service';
import { ShortcutsService } from './shortcuts/shortcuts.service';

@Component({
  selector: 'evt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  @ViewChild('mainSpinner') mainSpinner: ElementRef;
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

  @HostListener('window:keyup', ['$event']) keyEvent(e: KeyboardEvent) { this.shortcutsService.handleKeyboardEvent(e); }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
