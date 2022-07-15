import { ChangeDetectionStrategy, Component, HostListener, Input, Optional, SkipSelf } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { AppConfig } from 'src/app/app.config';
import { ApparatusEntry, HighlightData } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EVTModelService } from '../../services/evt-model.service';
import { Highlightable } from '../components-mixins';
import { ApparatusEntryDetailComponent } from './apparatus-entry-detail/apparatus-entry-detail.component';

export interface ApparatusEntryComponent extends Highlightable { }

@Component({
  selector: 'evt-apparatus-entry',
  templateUrl: './apparatus-entry.component.html',
  styleUrls: ['./apparatus-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@register(ApparatusEntry)
export class ApparatusEntryComponent {
  @Input() data: ApparatusEntry;

  public opened = false;
  public isInsideAppDetail: boolean;
  public appIsInsideApp: boolean;
  public nestedApps: ApparatusEntry[] = [];

  private _hd: HighlightData;
  @Input() set highlightData(hd: HighlightData) {
    hd.highlight = true;
    hd.highlightColor = AppConfig.evtSettings.edition.readingColorLight;
    this._hd = hd;
  }

  get highlightData() {
    return this._hd;
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (this.appIsInsideApp) {
      this.parentAppComponent._hd = {
        ...this._hd,
        highlightColor: AppConfig.evtSettings.edition.readingColorLight,
      };
    }
    this._hd = {
      ...this._hd,
      highlightColor: AppConfig.evtSettings.edition.readingColorDark,
    };
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (!this.opened) {
      this._hd = {
        ...this._hd,
        highlightColor: AppConfig.evtSettings.edition.readingColorLight,
      };
    }
  }

  variance$ = this.evtModelService.appVariance$.pipe(
    map((variances) => variances[this.data.id]),
    shareReplay(1),
  );

  constructor(
    private evtModelService: EVTModelService,
    @Optional() private parentDetailComponent?: ApparatusEntryDetailComponent,
    @Optional() @SkipSelf() private parentAppComponent?: ApparatusEntryComponent,
  ) {
    this.isInsideAppDetail = !!this.parentDetailComponent;
    this.appIsInsideApp = !!this.parentAppComponent;
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
