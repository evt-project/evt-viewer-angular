import { Component, ElementRef, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Witness } from 'src/app/models/evt-models';
import { EVTModelService } from 'src/app/services/evt-model.service';
import { EVTStatusService } from 'src/app/services/evt-status.service';
import { EvtIconInfo } from 'src/app/ui-components/icon/icon.component';
import { ModalComponent } from 'src/app/ui-components/modal/modal.component';
import { ModalService } from 'src/app/ui-components/modal/modal.service';
import { ModalWitnessItem } from './modal-witness-item/modal-witness-item.component';

@Component({
  selector: 'evt-collation',
  templateUrl: './collation.component.html',
  styleUrls: ['./collation.component.scss'],
})
export class CollationComponent implements OnDestroy {
  @ViewChild('collationPanel', { static: false }) collationPanel: ElementRef;
  @ViewChild('witnessesModal', { static: false }) witnessesModal: ModalComponent;
  private witnessModalRef: NgbModalRef = null;
  searchWitness = '';
  updateSearchTerm$ = new BehaviorSubject<string>('');
  private latestWitnesses$ = new BehaviorSubject<WitnessItem[]>([]);
  private itemsChanged$ = new Subject<void>();
  private itemsChangedSubs: Subscription;

  backIcon: EvtIconInfo = { iconSet: 'fas', icon: 'arrow-left' };

  public currentWitnesses$: Observable<WitnessItem[]> = combineLatest([
    this.evtModelService.flattenedWitnesses$,
    this.evtStatusService.currentStatus$
  ]).pipe(
    map(([flattenedWitnesses, status]) => {
      const currentWitnessesIds = status.witnesses;
      const result: WitnessItem[] = flattenedWitnesses
        .filter(w => currentWitnessesIds.includes(w.id))
        .sort((a, b) => currentWitnessesIds.indexOf(a.id) - currentWitnessesIds.indexOf(b.id))
        .map((w, i) => {
          if (typeof w.name !== 'string') {
            throw new Error("Witness name must be a string but was: " + w.name);
          }

          return {
            id: w.id,
            label: w.name,
            itemConfig: { cols: 1, rows: 1, y: 0, x: i },
            currentPageId: status.page.id,
            anchestorsIds: w.anchestorWitnessesIds
          };
        });
      return result;
    }),
    tap(witnesses => {
      this.latestWitnesses$.next(witnesses);
      this.updateGridsterOptions(witnesses);
    })
  );

  public modalWitnesses$: Observable<ModalWitnessItem[]> = combineLatest([
    this.evtModelService.witnesses$,
    this.evtStatusService.currentStatus$,
    this.updateSearchTerm$.pipe(debounceTime(300), distinctUntilChanged())
  ]).pipe(
    map(([witnesses, status, searchTerm]) => {
      if (!searchTerm) {
        // No search → Return the hierarchical structure
        return witnesses.map(w => this.createPopoverWitnessItem(w, status.witnesses));
      }

      // Search term exists → Return only matching witnesses and their children (flattened)
      const flatResult: Map<string, ModalWitnessItem> = new Map();
      witnesses.forEach(w => this.collectMatchingWitnesses(w, status.witnesses, searchTerm, flatResult));
      return Array.from(flatResult.values());
    })
  );

  /**
   * Recursively finds matching witnesses and their children,
   * adding ONLY them to the result (excluding parents unless they match search term).
   */
  private collectMatchingWitnesses(witness: Witness, currentWitnessesIds: string[], searchTerm: string, result: Map<string, ModalWitnessItem>): void {
    let matches = witness.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Recursively check all children
    for (let child of witness.witnesses) {
      this.collectMatchingWitnesses(child, currentWitnessesIds, searchTerm, result);

      if (child.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        matches = true;
        if (!result.has(child.id)) {
          result.set(child.id, {
            id: child.id,
            label: child.name,
            witnesses: [],
            canSelect: !currentWitnessesIds.includes(child.id)
          });
        }
      }
    }

    // If the witness itself matches, add it
    if (matches && !result.has(witness.id)) {
      result.set(witness.id, {
        id: witness.id,
        label: witness.name,
        witnesses: [],
        canSelect: !currentWitnessesIds.includes(witness.id)
      });
    }
  }

  private createPopoverWitnessItem(witness: Witness, currentWitnessesIds: string[]): ModalWitnessItem {
    return {
      id: witness.id,
      label: witness.name,
      witnesses: witness.witnesses.map(w => this.createPopoverWitnessItem(w, currentWitnessesIds)),
      canSelect: !currentWitnessesIds.includes(witness.id)
    };
  }

  onSearchChanged(searchTerm: string) {
    this.updateSearchTerm$.next(searchTerm);
  }


  public options: GridsterConfig = {
    gridType: GridType.Fit,
    displayGrid: DisplayGrid.None,
    margin: 0,
    maxCols: 2,
    maxRows: 1,
    draggable: {
      enabled: false,
    },
    resizable: {
      enabled: false,
    },
  };
  public textPanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 0 };
  public collationPanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 1 };
  public collationOptions: GridsterConfig = {
    gridType: GridType.Fit,
    displayGrid: DisplayGrid.None,
    compactType: CompactType.CompactLeft,
    scrollToNewItems: true,
    margin: 0,
    maxRows: 1,
    draggable: {
      enabled: true,
      ignoreContent: true,
      dragHandleClass: 'panel-header',
      ignoreContentClass: 'no-drag'
    },
    resizable: {
      enabled: false,
    },
    mobileBreakpoint: 0,
    itemResizeCallback: () => this.updateFixedColWidth(this.latestWitnesses$.value),
    itemChangeCallback: () => this.itemsChanged$.next(),
  };

  public currentPageID$ = this.evtStatusService.currentStatus$.pipe(
    map(({ page }) => page.id),
  );

  public witnessBtn$: Observable<{
    label: string,
    additionalClasses: string,
    title: string,
    icon: EvtIconInfo,
    placement: string,
    floatRight: boolean
  }> = this.currentWitnesses$.pipe(
    map(witnesses => {
      return {
        label: witnesses.length > 0 ? '' : 'addWitness',
        title: witnesses.length > 0 ? 'addWitness' : '',
        additionalClasses: `btn-floating ${witnesses.length > 0 ? 'rounded-circle' : ''}`,
        icon: { iconSet: 'fas', icon: 'plus' },
        placement: witnesses.length > 0 ? 'left' : 'right',
        floatRight: witnesses.length > 0
      };
    })
  );

  constructor(
    private evtStatusService: EVTStatusService,
    private evtModelService: EVTModelService,
    private modalService: ModalService,
  ) {
    this.itemsChangedSubs = this.itemsChanged$.pipe(
      debounceTime(100)
    ).subscribe(() => {
      const value = this.latestWitnesses$.value
        .sort((a, b) => a.itemConfig.x - b.itemConfig.x)
        .map(x => x.id);
      this.evtStatusService.updateWitnesses$.next(value)
    })
  }

  changePage(pageId: string) {
    this.evtStatusService.updatePageId$.next(pageId);
  }

  openModal(content: TemplateRef<any>) {
    this.witnessModalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    setTimeout(() => {
      const input = document.getElementById('search-input');
      input?.focus();
    }, 500);
  }
  closeModal() {
    this.modalService.close(this.witnessModalRef);
  }

  addWitness(witnessId: string) {
    if (this.latestWitnesses$.value.some(w => w.id === witnessId)) {
      throw new Error("Witness is already present: " + witnessId);
    }

    this.evtStatusService.updateWitnesses$.next(
      [...this.latestWitnesses$.value.filter(w => w.id !== witnessId).map(w => w.id), witnessId]
    )
    this.closeModal();
  }

  removeWitness(witnessId: string) {
    this.evtStatusService.updateWitnesses$.next(
      [...this.latestWitnesses$.value.filter(w => w.id !== witnessId).map(w => w.id)]
    )
  }

  private updateGridsterOptions(witnesses: WitnessItem[]) {
    this.options.maxCols = witnesses.length <= 1 ? 2 : 3;
    this.collationPanelItem.cols = witnesses.length <= 1 ? 1 : 2;

    this.collationOptions.maxCols = witnesses.length;
    this.collationOptions.gridType = witnesses.length <= 2 ? GridType.Fit : GridType.HorizontalFixed;
    this.changedOptions();
    this.updateFixedColWidth(witnesses);
  }

  private changedOptions() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
    if (this.collationOptions.api && this.collationOptions.api.optionsChanged) {
      this.collationOptions.api.optionsChanged();
    }
  }

  private updateFixedColWidth(witnesses: WitnessItem[]) {
    if (!this.collationPanel) return;
    const collationPanelEl = this.collationPanel.nativeElement as HTMLElement;
    const fixedColWidth = collationPanelEl.clientWidth * 0.416666666667;
    this.collationOptions.fixedColWidth = witnesses.length > 2 ? fixedColWidth : undefined;
    this.changedOptions();
  }

  ngOnDestroy(): void {
    this.itemsChangedSubs?.unsubscribe();
  }
}

export interface WitnessItem {
  id: string,
  label: string;
  itemConfig: GridsterItem;
  currentPageId: string;
  anchestorsIds: string[];
}
