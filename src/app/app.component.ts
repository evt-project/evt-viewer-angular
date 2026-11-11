import { Component, ElementRef, HostBinding, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AppConfig } from './app.config';
import { ThemesService } from './services/themes.service';
import { ShortcutsService } from './shortcuts/shortcuts.service';
import { EvtIconInfo } from './ui-components/icon/icon.component';
import { EVTStatusService } from './services/evt-status.service';
import { EVTModelService } from './services/evt-model.service';

@Component({
  selector: 'evt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  @ViewChild('mainSpinner') mainSpinner: ElementRef;
  private subscriptions: Subscription[] = [];
  public hasNavBar = AppConfig.evtSettings.ui.enableNavBar;
  public navbarOpened$ = new BehaviorSubject(this.hasNavBar && AppConfig.evtSettings.ui.initNavBarOpened);


  public navbarTogglerIcon$: Observable<EvtIconInfo> = this.navbarOpened$.pipe(
    map((opened: boolean) => opened ? { icon: 'caret-down', iconSet: 'fas' } : { icon: 'caret-up', iconSet: 'fas' }),
  );

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private shortcutsService: ShortcutsService,
    private themes: ThemesService,
    private titleService: Title,
    private evtStatusService: EVTStatusService,
    private evtModelService: EVTModelService,
    private translate: TranslateService,
  ) {
    this.subscriptions.push(this.translate.get('loading').subscribe((text: string) => {
      const label = document.querySelector('#evt-boot-loader .evt-boot-text');
      if (label) { label.textContent = text; }
    }));
    this.subscriptions.push(this.evtModelService.pages$.pipe(take(1)).subscribe({
      // setTimeout lets Angular render the first page before the loader goes away
      next: () => setTimeout(() => this.hideBootLoader()),
      error: () => this.hideBootLoader(),
    }));

    this.evtStatusService.currentViewMode$.pipe().subscribe((view) => {
      if (view !== undefined && view.id === 'synopticEdition') {
        this.navbarOpened$.next(false);
        this.hasNavBar = false;
      } else {
        this.navbarOpened$.next(true);
        this.hasNavBar = true;
      }
    });
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
    this.titleService.setTitle(AppConfig.evtSettings.edition.editionTitle || 'EVT');
  }

  @HostBinding('attr.data-theme') get dataTheme() { return this.themes.getCurrentTheme().value; }

  toggleToolbar() {
    this.navbarOpened$.next(!this.navbarOpened$.getValue());
    window.dispatchEvent(new Event('resize')); // Needed to tell Gridster to resize
  }

  private hideBootLoader() {
    const loader = document.getElementById('evt-boot-loader');
    if (!loader) { return; }
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 300);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(e: KeyboardEvent) {
    this.shortcutsService.handleKeyboardEvent(e);
  }
}
