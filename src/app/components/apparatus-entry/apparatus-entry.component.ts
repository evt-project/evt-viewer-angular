import { ChangeDetectionStrategy, Component, HostListener, Input, OnInit, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AppConfig } from 'src/app/app.config';
import { ApparatusEntry, Reading } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EVTModelService } from '../../services/evt-model.service';
import { EditionlevelSusceptible, Highlightable, ShowDeletionsSusceptible } from '../components-mixins';
import { ApparatusEntryDetailComponent } from './apparatus-entry-detail/apparatus-entry-detail.component';
import { WitnessPanelService } from 'src/app/panels/witness-panel/witness-panel.service';
import { EVTStatusService } from 'src/app/services/evt-status.service';
import { ActivatedRoute } from '@angular/router';

export interface ApparatusEntryComponent extends EditionlevelSusceptible, Highlightable, ShowDeletionsSusceptible { }

@Component({
  selector: 'evt-apparatus-entry',
  templateUrl: './apparatus-entry.component.html',
  styleUrls: ['./apparatus-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
@register(ApparatusEntry)
export class ApparatusEntryComponent implements OnInit {
  @Input() data: ApparatusEntry;
  @Input() selectedLayer: string;

  public updateIsOpened$ = new BehaviorSubject<boolean>(undefined);
  public isOpened$ = combineLatest([
    this.updateIsOpened$,
    this.statusService.currentApparatus$.pipe(
      map(exponent => this.data.exponent != null && this.data.exponent === exponent)
    ),
    this.route.queryParamMap.pipe(
      map(x => {
        const app = x.get("app");
        return this.data.id === app;
      }),
    )
  ]).pipe(
    map(([updateIsOpened, matchesExponent, initialMatchesIdFromUrl]) => {
      // updateIsOpened is undefined at the start so the other parameters are evaluated.
      // Then, when the user click on the apparatus entry to close or open the box, 
      // it should have the precedence over the other parameters.
      if (updateIsOpened !== undefined) {
        return updateIsOpened;
      }
      else {
        return matchesExponent || initialMatchesIdFromUrl;
      }
    })
  );

  get lacunaStart() {
    const reading = this.getWitnessReadingOrDefault();
    if (!reading) return null;

    return reading.lacunas.lacunaStart;
  }

  get lacunaEnd() {
    const reading = this.getWitnessReadingOrDefault();
    if (!reading) return null;

    return reading.lacunas.lacunaEnd;
  }


  getWitnessReadingOrDefault() {
    const readings = this.data.readings;
    const reading = readings.find(x => x.witIDs.includes(this.witnessPanelService.witnessId))
    return reading;
  }

  public isInsideAppDetail: boolean;
  public isNestedApp: boolean;
  public nestedApps: ApparatusEntry[] = [];

  isInWitnessPanel: boolean;
  selectedReading?: Reading;

  private toggleAppBoxStrategy: Function;
  private closeAppBox: Function;

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
    private statusService: EVTStatusService,
    private route: ActivatedRoute,
    @Optional() private parentDetailComponent?: ApparatusEntryDetailComponent,
    @Optional() @SkipSelf() private parentAppComponent?: ApparatusEntryComponent,
    @Optional() private witnessPanelService?: WitnessPanelService,
  ) {
    this.isInsideAppDetail = !!this.parentDetailComponent;
    this.isNestedApp = !!this.parentAppComponent;
  }

  ngOnInit(): void {
    this.isInWitnessPanel = !!this.witnessPanelService;
    if (this.isInWitnessPanel) {
      const isWitnessExcluded = this.data.isWitnessExcluded(this.witnessPanelService.witnessId);
      this.selectedReading = isWitnessExcluded ? this.data.lemma : this.data.orderedReadings
        .find(r => r.witIDs.includes(this.witnessPanelService.witnessId)
          || r.witIDs.some(x => this.witnessPanelService.anchestorsIds.includes(x)));
    }

    if (this.data.exponent) { // depa
      this.toggleAppBoxStrategy = () => {
        const value = this.statusService.updateApparatus$.value === this.data.exponent ? null : this.data.exponent;
        this.statusService.updateApparatus$.next(value)
      }
      this.closeAppBox = () => this.statusService.updateApparatus$.next(null);
    }
    else { // inline
      this.toggleAppBoxStrategy = () => {
        const value = this.updateIsOpened$.value;
        this.updateIsOpened$.next(!value);
      }
      this.closeAppBox = () => this.updateIsOpened$.next(false);
    }
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (this.isNestedApp) {
      this.parentAppComponent.highlightColor$.next(AppConfig.evtSettings.edition.readingColorLight);
    }
    this.highlightColor$.next(AppConfig.evtSettings.edition.readingColorDark);
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.isNestedApp) {
      this.highlightColor$.next(AppConfig.evtSettings.edition.readingColorDark);
    } else {
      this.highlightColor$.next(AppConfig.evtSettings.edition.readingColorLight)
    }
  }

  toggleAppEntryBox(e: MouseEvent) {
    e.stopPropagation();
    this.toggleAppBoxStrategy();
  }

  closeAppEntryBox() {
    this.closeAppBox();
  }

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }
}
