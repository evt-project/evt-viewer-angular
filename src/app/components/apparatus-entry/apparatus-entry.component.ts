import { ChangeDetectionStrategy, Component, HostListener, Input, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AppConfig } from 'src/app/app.config';
import { ApparatusEntry, HighlightData } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EVTModelService } from '../../services/evt-model.service';
import { EditionlevelSusceptible, Highlightable } from '../components-mixins';
import { ApparatusEntryDetailComponent } from './apparatus-entry-detail/apparatus-entry-detail.component';

export interface ApparatusEntryComponent extends EditionlevelSusceptible, Highlightable { }

@Component({
  selector: 'evt-apparatus-entry',
  templateUrl: './apparatus-entry.component.html',
  styleUrls: ['./apparatus-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@register(ApparatusEntry)
export class ApparatusEntryComponent {
  highlightData$ = new BehaviorSubject<HighlightData | undefined>({
    highlight: true,
    highlightColor: AppConfig.evtSettings.edition.readingColorLight,
  });

  constructor(
    private evtModelService: EVTModelService,
    @Optional() private parentDetailComponent?: ApparatusEntryDetailComponent,
    @Optional() @SkipSelf() private parentAppComponent?: ApparatusEntryComponent,
  ) {
    this.isInsideAppDetail = !!this.parentDetailComponent;
    this.appIsInsideApp = !!this.parentAppComponent;
  }
  @Input() data: ApparatusEntry;

  public opened = false;
  public isInsideAppDetail: boolean;
  public appIsInsideApp: boolean;
  public nestedApps: ApparatusEntry[] = [];

  variance$ = this.evtModelService.appVariance$.pipe(
    map((variances) => variances[this.data.id]),
    shareReplay(1),
  );

  @HostListener('mouseenter') onMouseEnter() {
    if (this.appIsInsideApp) {
      this.parentAppComponent.highlightData$.next({
        highlight: true,
        highlightColor: AppConfig.evtSettings.edition.readingColorLight,
      });
    }
    this.highlightData$.next({
      highlight: true,
      highlightColor: AppConfig.evtSettings.edition.readingColorDark,
    });
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlightData$.next({
      highlight: true,
      highlightColor: !this.opened ? AppConfig.evtSettings.edition.readingColorLight : AppConfig.evtSettings.edition.readingColorDark,
    });
  }

  toggleAppEntryBox(e: MouseEvent) {
    e.stopPropagation();
    this.opened = !this.opened;
  }

  closeAppEntryBox() {
    this.opened = false;
  }

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }
}
