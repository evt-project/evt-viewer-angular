import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridsterConfig, GridsterItem, GridType, DisplayGrid, CompactType } from 'angular-gridster2';


@Component({
  selector: 'evt-collation',
  templateUrl: './collation.component.html',
  styleUrls: ['./collation.component.scss']
})
export class CollationComponent implements OnInit, OnDestroy {
  @ViewChild('collationPanel', { static: true }) collationPanel: ElementRef;

  private witnesses: WitnessItem[] = [];

  public options: GridsterConfig = {};
  public textPanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 0 };
  public collationPanelItem: GridsterItem = { cols: 1, rows: 1, y: 0, x: 1 };
  public collationOptions: GridsterConfig = {};

  private subscriptions = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.initGridster();
    this.initPageAndWitnesses();
  }

  getWitnesses() {
    return this.witnesses;
  }

  addWitness() {
    const id = (this.witnesses.length + 1).toString(); // TEMP
    const newWit = {
      label: id,
      itemConfig: { cols: 1, rows: 1, y: 0, x: this.witnesses.length + 1, id }
    };

    this.witnesses.push(newWit); // TEMP
    this.updateGridsterOptions();
    // TODO: Come gestiamo la rotta nel caso di testimoni collazionati?
  }

  removeWitness(index) {
    this.witnesses.splice(index, 1);
    this.updateGridsterOptions();
  }

  private initPageAndWitnesses() {
    // TODO: subscribe to route params
  }

  private initGridster() {
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.None,
      margin: 0,
      maxCols: 2,
      maxRows: 1,
      draggable: {
        enabled: false
      },
      resizable: {
        enabled: false
      }
    };
    this.collationOptions = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.None,
      compactType: CompactType.CompactLeft,
      scrollToNewItems: true,
      margin: 0,
      maxRows: 1,
      draggable: {
        enabled: true,
        ignoreContent: true,
        dragHandleClass: 'panel-header'
      },
      resizable: {
        enabled: false
      },
      mobileBreakpoint: 0,
      itemResizeCallback: this.updateFixedColWidth.bind(this),
      itemChangeCallback: this.itemChange.bind(this)
    };
  }

  private itemChange() {
    const updatedWitList: string[] = [];
    for (const witItem of this.witnesses) {
      const witIndex = witItem.itemConfig.x;
      updatedWitList[witIndex] = witItem.label;
    }
    // TODO: Use this list to update URL params
    console.log('TODO! Use this list to update URL params', updatedWitList);
  }

  private updateGridsterOptions() {
    this.options.maxCols = this.witnesses.length <= 1 ? 2 : 3;
    this.collationPanelItem.cols = this.witnesses.length <= 1 ? 1 : 2;

    this.collationOptions.maxCols = this.witnesses.length;
    this.collationOptions.gridType = this.witnesses.length <= 2 ? GridType.Fit : GridType.HorizontalFixed;
    this.changedOptions();
    this.updateFixedColWidth();
  }

  private changedOptions() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
    if (this.collationOptions.api && this.collationOptions.api.optionsChanged) {
      this.collationOptions.api.optionsChanged();
    }
  }

  private updateFixedColWidth() {
    const collationPanelEl = this.collationPanel.nativeElement as HTMLElement;
    const fixedColWidth = collationPanelEl.clientWidth * 0.416666666667;
    this.collationOptions.fixedColWidth = this.witnesses.length > 2 ? fixedColWidth : undefined;
    this.changedOptions();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}

interface WitnessItem {
  label: string;
  itemConfig: GridsterItem;
}
