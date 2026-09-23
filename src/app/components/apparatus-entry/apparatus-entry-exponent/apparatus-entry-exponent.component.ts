import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { ApparatusEntryExponent } from 'src/app/models/evt-models';
import { register } from 'src/app/services/component-register.service';
import { EVTStatusService } from 'src/app/services/evt-status.service';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import { HoverService } from 'src/app/services/hover.service';
import { isElementBetween } from 'src/app/utils/dom-utils';
import { EditionlevelSusceptible } from '../../components-mixins';

export interface ApparatusEntryExponentComponent extends EditionlevelSusceptible { }

@register(ApparatusEntryExponent)
@Component({
  selector: 'evt-apparatus-entry-exponent',
  templateUrl: './apparatus-entry-exponent.component.html',
  styleUrls: ['./apparatus-entry-exponent.component.scss']
})

export class ApparatusEntryExponentComponent implements OnDestroy {
  private _data: ApparatusEntryExponent;
  @Input() set data(v: ApparatusEntryExponent) {
    this._data = v;
    this.exponentId = v?.id().valueWithoutRef;
  }
  get data() { return this._data; }
  @ViewChild('evtExponent', { read: ElementRef }) evtExponent!: ElementRef;

  exponentId: string;

  noteType: string = 'critical'; // Temp, it's probably correct but needs confirmation
  apparatusDetailsShown$ = combineLatest([
    this.statusService.currentViewMode$,
    this.hoverService.selectedApparatusEntries$
  ]).pipe(
    map(([viewMode, selectedAppEntries]) => {
      if (viewMode.id === 'readingText') {
        return false;
      }
      const id = this.data.id();
      const result = selectedAppEntries.find(app => id.equals(app.additionalAttributes.exponentId));
      return result;
    })
  );

  private isBetweenElementMemo = new Map<string, boolean>();
  private updateHovered$ = new BehaviorSubject<boolean>(false);

  private isSelected$ = this.hoverService.selectedApparatusEntries$.pipe(
    map(selectedAppEntries => {
      const isSelected = selectedAppEntries.some(app => this.data.id().equals(app.additionalAttributes.exponentId));
      return isSelected;
    }),
    tap(isSelected => {
      const FLASH_CLASS = 'flash-highlight';
      const FLASH_DURATION_MS = 3_000;
      const el = this.evtExponent?.nativeElement;
      if (!el) return;
      clearTimeout(this.flashTimeout);
      el.classList.remove(FLASH_CLASS);
      if (!isSelected) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      void el.offsetWidth; // reflow, so the animation restarts when the same exponent is selected again
      el.classList.add(FLASH_CLASS);
      this.flashTimeout = setTimeout(() => el.classList.remove(FLASH_CLASS), FLASH_DURATION_MS);
    }));

  private flashTimeout: ReturnType<typeof setTimeout>;

  isHighlighted$ = combineLatest([
    this.updateHovered$,
    this.isSelected$,
    this.hoverService.hoveredTextOrDefault$,
  ]).pipe(
    map(([updateHovered, isSelected, hoveredText]) => {
      const value = this.hoverService.highlightedAppExponents$.value.filter(x => !x.id().equals(this.data.id()));
      if (updateHovered || isSelected) {
        this.hoverService.highlightedAppExponents$.next([...value, this.data]);
        return true;
      }

      if (!hoveredText) {
        this.hoverService.highlightedAppExponents$.next([]);
        return false;
      }

      const { id, element, isHovering } = hoveredText;
      if (!this.isBetweenElementMemo.has(id)) {
        const { fromEl, toEl } = this.hoverService.getDepaElements(this.data);
        const result = isElementBetween(fromEl, element, toEl);
        this.isBetweenElementMemo.set(id, result);
      }

      const result = isHovering && this.isBetweenElementMemo.get(id);
      const newValue = result ? [...value, this.data] : value;
      this.hoverService.highlightedAppExponents$.next(newValue);
      return result;
    })
  );

  constructor(
    private statusService: EVTStatusService,
    private hoverService: HoverService,
  ) {
  }

  ngOnInit(): void {

  }

  onExponentButtonClicked() {
    this.hoverService.toggleApparatusEntry(this.data.appEntry);
  }

  onHover(isHovering: boolean) {
    this.updateHovered$.next(isHovering);
  }

  ngOnDestroy(): void {
    clearTimeout(this.flashTimeout);
  }
}