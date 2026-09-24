/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { AppConfig, BibliographicStyle, CitingRanges } from 'src/app/app.config';
import { AuthorDetail, BibliographicEntry, BibliographicStructEntry } from 'src/app/models/evt-models';

@Component({
  selector: 'evt-styled-biblio-entry',
  templateUrl: './biblio-styled.component.html',
  styleUrls: ['./biblio-styled.component.scss'],
})
export class StyledBiblioEntryComponent implements OnChanges, AfterViewInit {

  @ViewChild('title', { static: false }) title: TemplateRef<any>;
  @ViewChild('author', { static: false }) author: TemplateRef<any>;
  @ViewChild('publication', { static: false }) publication: TemplateRef<any>;
  @ViewChild('editor', { static: false }) editor: TemplateRef<any>;
  @ViewChild('date', { static: false }) date: TemplateRef<any>;
  @ViewChild('pubPlace', { static: false }) pubPlace: TemplateRef<any>;
  @ViewChild('publisher', { static: false }) publisher: TemplateRef<any>;
  @ViewChild('doi', { static: false }) doi: TemplateRef<any>;


  @Input() data: BibliographicEntry | BibliographicStructEntry;
  @Input() style: string = AppConfig.evtSettings.ui.defaultBibliographicStyle;

  public biblEntry: any;
  public showList: string[];
  public showAttrNames = AppConfig.evtSettings.ui.biblTab.showAttrNames;
  public showEmptyValues = AppConfig.evtSettings.ui.biblTab.showEmptyValues;
  public inline = AppConfig.evtSettings.ui.biblTab.inline;
  public isCommaSeparated = AppConfig.evtSettings.ui.biblTab.commaSeparated;
  public showMainElemTextContent = AppConfig.evtSettings.ui.biblTab.showMainElemTextContent;
  public styleProperties : BibliographicStyle;

  get isEntry(): boolean {
    return this.biblEntry?.type === BibliographicEntry;
  }

  get isStructEntry(): boolean {
    return this.biblEntry?.type === BibliographicStructEntry;
  }

  flattenBiblStruct(entry: BibliographicStructEntry): BibliographicEntry[] {
    return entry.analytic.concat(entry.monogrs.concat(entry.series));
  }

  getContextForElement(element: string, structEntry: BibliographicStructEntry): BibliographicEntry[]{
    let context: BibliographicEntry[];
    switch(element){
      case 'title':
        context = structEntry.analytic;
        break;
      case 'publication':
      case 'date':
      case 'publPlace':
      case 'publisher':
      case 'editor':
        context = structEntry.monogrs;
        break;
      default:
        context = this.flattenBiblStruct(structEntry);
        break;
    }

    return context;
  }

  firstContainsProperty(entries: BibliographicEntry[], element:string): boolean{
    const elementInFirstEntry = entries[0]?.[element];

    return elementInFirstEntry && elementInFirstEntry.length > 0;
  }

  containsOnlyEmptyValues(arr: string[]): boolean{
    return arr.reduce((prev, x) => (x === '') && prev, true);
  }

  requiresAcronym(elem: CitingRanges): boolean{
    const publicationStyle = this.styleProperties.publicationStyle || { citingAcronym: 'none' };
    if(!publicationStyle?.citingAcronym) { return false; }

    if(publicationStyle.citingAcronym === 'all'){
      return true;
    }else if(publicationStyle.citingAcronym === 'none'){
      return false;
    }

    return publicationStyle.citingAcronym.includes(elem);
  }

  getPublisherDetailsOrder(): string[]{
    return this.showList.filter((x) => x === 'publisher' || x === 'pubPlace');
  }

  getAuthorsDetails(entries: BibliographicEntry[]): AuthorDetail[]{
    return entries.reduce((prev, e) => prev.concat(e.authorsDetails), []);
  }

  isStructured(entry: BibliographicEntry): boolean{
    // searching for the most relevant signs of a structured entry.
    return entry.originalEncoding.querySelectorAll('title, author, date').length > 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.data.type && this.data.type === BibliographicEntry){
      this.biblEntry = this.data as BibliographicEntry;
    }
    if(this.data.type && this.data.type === BibliographicStructEntry){
      this.biblEntry = this.data as BibliographicStructEntry;
    }
    if(changes.style){
      this.showList = AppConfig.evtSettings.ui.allowedBibliographicStyles[this.style].propsOrder;
      this.styleProperties = AppConfig.evtSettings.ui.allowedBibliographicStyles[this.style].properties;
    }
  }

  constructor(private cd: ChangeDetectorRef){}
  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }
}
