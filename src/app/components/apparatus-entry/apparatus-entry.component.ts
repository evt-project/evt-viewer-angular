import { ChangeDetectionStrategy, Component, HostListener, Input, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AppConfig } from 'src/app/app.config';
import { ApparatusEntry } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EVTModelService } from '../../services/evt-model.service';
import { EditionlevelSusceptible, Highlightable, ShowDeletionsSusceptible } from '../components-mixins';
import { ApparatusEntryDetailComponent } from './apparatus-entry-detail/apparatus-entry-detail.component';

export interface ApparatusEntryComponent extends EditionlevelSusceptible, Highlightable, ShowDeletionsSusceptible { }

@Component({
  selector: 'evt-apparatus-entry',
  templateUrl: './apparatus-entry.component.html',
  styleUrls: ['./apparatus-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
@register(ApparatusEntry)
export class ApparatusEntryComponent {
  @Input() data: ApparatusEntry;
  @Input() selectedLayer: string;

  public opened = false;
  public isInsideAppDetail: boolean;
  public isNestedApp: boolean;
  public nestedApps: ApparatusEntry[] = [];

  variance$ = this.evtModelService.appVariance$.pipe(
    map((variances) => variances[this.data.id]),
    shareReplay(1),
  );

  highlightColor$ = new BehaviorSubject<string>(AppConfig.evtSettings.edition.readingColorLight);
  highlightData$ = this.highlightColor$.pipe(
    map((color) => ({
      highlight: true,
      highlightColor: color,
    })),
  );

  constructor(
    private evtModelService: EVTModelService,
    @Optional() private parentDetailComponent?: ApparatusEntryDetailComponent,
    @Optional() @SkipSelf() private parentAppComponent?: ApparatusEntryComponent,
  ) {
    this.isInsideAppDetail = !!this.parentDetailComponent;
    this.isNestedApp = !!this.parentAppComponent;
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (this.isNestedApp) {
      this.parentAppComponent.highlightColor$.next(AppConfig.evtSettings.edition.readingColorLight);
    }
    this.highlightColor$.next(AppConfig.evtSettings.edition.readingColorDark);
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.opened) {
      this.highlightColor$.next(AppConfig.evtSettings.edition.readingColorDark);
    } else {
      this.highlightColor$.next(AppConfig.evtSettings.edition.readingColorLight)
    }
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
