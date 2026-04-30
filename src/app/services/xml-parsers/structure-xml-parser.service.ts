import { Injectable } from '@angular/core';
import { AppConfig, ImagesSource } from '../../app.config';
import { Anchor, ApparatusEntry, ApparatusEntryExponent, Attribute, Cb, DocumentApparatusEntries, EditionStructure, ElementApparatusEntries, GenericElement, LacunaPair, OriginalEncodingNodeType, Page, Text, XMLElement } from '../../models/evt-models';
import { createNsResolver, deepSearch, getElementsBetweenTreeNode, isNestedInElem } from '../../utils/dom-utils';
import { GenericParserService } from './generic-parser.service';
import { getID, getNOrDefaultFromElement, ParseResult } from './parser-models';
import { getFromAttributeOrDefault, getToAttributeOrDefault } from 'src/app/extensions/apparatus.extensions';
import { FROM_ATTRIBUTE, TO_ATTRIBUTE } from 'src/app/models/constants';
import { v4 as uuidv4 } from 'uuid';
import { AlphabetService } from '../alphabet.service';
import { AppParser } from './app-parser';
import { ErrorsService } from '../errors.service';
import { ParserRegister } from '.';

@Injectable({
  providedIn: 'root',
})
export class StructureXmlParserService {
  constructor(
    private genericParserService: GenericParserService,
    private alphabetService: AlphabetService,
    private errorService: ErrorsService,
  ) {
  }

  private divParser = ParserRegister.get('div');
  private appParser = AppParser.create();
  private frontOrigContentAttr = 'document_front';
  private readonly frontTagName = 'front';
  private readonly backTagName = 'back';
  private readonly structureSeparators = AppConfig.evtSettings.edition.structureSeparators.join(',');
  private readonly bodyTagName = 'body';

  allApps: XMLElement[] = [];
  groupedByWitLacunas = new Map<string, LacunaPair[]>();

  private _front: XMLElement | null = null;
  get front(): XMLElement | null { return this.front };
  get parsedFront(): ParseResult<GenericElement> | null {
    if(!this._front) return null;

    const tempFront = this._front.cloneNode(true) as HTMLElement;
    tempFront.querySelectorAll(this.structureSeparators).forEach(x => x.remove());
    const result = this.genericParserService.parse(tempFront);
    return result;
  };

  private _body: XMLElement = null;
  get body(): XMLElement { return this._body };

  private _back: XMLElement = null;
  get back(): XMLElement { return this._back };

  readonly appExponents: Map<string, ApparatusEntryExponent> = new Map();

  public parsePages(imagesSource: ImagesSource, source: XMLElement): EditionStructure {
    const editionStructure = {
      pages: [] as Page[],
      documentApparatusEntries: new DocumentApparatusEntries()
    };

    if (!source) return editionStructure;

    this._front = source.querySelector(this.frontTagName);
    this._body = source.querySelector(this.bodyTagName);
    this._back = source.querySelector(this.backTagName);

    const pbs = Array.from(source.querySelectorAll(this.structureSeparators));//.filter((p) => !p.getAttribute('ed'));
    const frontPbs = pbs.filter((p) => isNestedInElem(p, this.frontTagName));
    const bodyPbs = pbs.filter((p) => isNestedInElem(p, this.bodyTagName));
    const doc = source.firstElementChild.ownerDocument;

    if (frontPbs.length > 0 && bodyPbs.length > 0) {
      const pages = pbs.map((pb: XMLElement, idx, arr: XMLElement[]) => this.parseDocumentPage(imagesSource, doc, pb, arr[idx + 1], 'text'));
      editionStructure.pages.push(...pages);
    }
    else {
      const frontPages = frontPbs.length === 0 && this._front && this.isMarkedAsOrigContent(this._front)
        ? [this.parseSinglePage(imagesSource, doc, this._front, `page_front_${uuidv4()}`, this.frontTagName, 'facs_front')]
        : frontPbs.map((pb, idx, arr) => this.parseDocumentPage(imagesSource, doc, pb as HTMLElement, arr[idx + 1] as HTMLElement, this.frontTagName));

      const bodyPages = bodyPbs.length === 0
        ? [this.parseSinglePage(imagesSource, doc, this._body, `page1_${uuidv4()}`, 'mainText', 'facs1')] // TODO: translate mainText
        : bodyPbs.map((pb, idx, arr) => this.parseDocumentPage(imagesSource, doc, pb as HTMLElement, arr[idx + 1] as HTMLElement, this.bodyTagName));

      editionStructure.pages.push(...frontPages, ...bodyPages);
    }

    for (const page of editionStructure.pages) {
      const parent = this.divParser.parse(document.createElement('div')) as GenericElement;
      parent.content = [...page.parsedContent];
      const shouldSubstitute = this.processCbRecursive(parent, page.parsedContent as GenericElement[]);
      if (shouldSubstitute) {
        page.parsedContent = [parent];
      }
    }

    const backElements = source.getElementsByTagName(this.backTagName);
    if (backElements.length === 0) return editionStructure;

    this.loadLacunas(backElements, source);

    return editionStructure;
  }

  public processCriticalApparatus(source: HTMLElement, editionStructure: EditionStructure): void {
    if (!this.allApps.length) {
      this.allApps = Array.from(source.querySelectorAll("app"));
      if (!this.allApps.length) {
        this.errorService.logWarning('There are no apps in the source');
        this.errorService.loadingEnd();
        return;
      }

      for (const app of this.allApps) {
        addIsDepaAttribute(app);
      }

      // this can load after some times as errors can be available later
      setTimeout(() => this.checkDepaErrors(source), 1_000);
    }

    const result = this.getDocumentApparatusEntries(editionStructure.pages);
    result.apps.forEach((value, key) => {
      editionStructure.documentApparatusEntries.apps.set(key, value);
    });

    this.processApparatusExponents(source, editionStructure);

    function addIsDepaAttribute(app: HTMLElement) {
      const isDepa = !app.closest("body");
      app.setAttribute("isDepa", isDepa.toString());
    }
  }

  private isIgnorableNode(node: GenericElement): boolean {
    if (node.type.name !== Text.name) return false;

    const text = (node as any).text ?? '';
    return text.trim().length === 0;
  }

  private loadLacunas(backElements: HTMLCollectionOf<Element>, source: HTMLElement) {
    const lacunasStart = Array.from(backElements[0].querySelectorAll('lacunaStart')).map(x => x as HTMLElement);
    const lacunasEnd = Array.from(backElements[0].querySelectorAll('lacunaEnd')).map(x => x as HTMLElement);

    for (const lacuna of lacunasStart.concat(lacunasEnd)) {
      const wit = Attribute.createOrDefault(lacuna.getAttribute('wit'))
        || Attribute.createOrDefault(lacuna.parentElement?.getAttribute('wit'));
      if (!wit) {
        this.errorService.logError("A Lacuna must either have a wit attribute or its parent should");
        continue;
      }

      lacuna.setAttribute('wit', wit.valueWithoutRef);

      const lacunaAnchestorApp = lacuna.closest('app') as HTMLElement;
      const startFrom = Attribute.createFromOrDefault(lacunaAnchestorApp);
      lacuna.setAttribute('from', startFrom.valueWithoutRef);
    }

    for (const lacunaStart of lacunasStart) {
      if (!lacunasEnd.length) break;

      const startWit = lacunaStart.getAttribute('wit');
      const index = lacunasEnd.findIndex(e => e.getAttribute('wit') === startWit);
      if (index === -1) continue;

      const lacunaEnd = lacunasEnd[index];
      if (!lacunaEnd) {
        this.errorService.logError(`Missing lacunaEnd for wit ${startWit}`);
        continue;
      }

      lacunasEnd.splice(index, 1);

      const startFrom = Attribute.createFromOrDefault(lacunaStart);
      const startAnchor = source.querySelector(`[*|id='${startFrom.valueWithoutRef}']`) as HTMLElement;

      const endFrom = Attribute.createFromOrDefault(lacunaEnd);
      const endAnchor = source.querySelector(`[*|id='${endFrom.valueWithoutRef}']`) as HTMLElement;

      const hasKey = this.groupedByWitLacunas.has(startWit);
      if (!hasKey) {
        this.groupedByWitLacunas.set(startWit, []);
      }
      const pairs = this.groupedByWitLacunas.get(startWit);
      pairs.push({ start: startAnchor, end: endAnchor });
    }
  }

  private processApparatusExponents(source: HTMLElement, editionStructure: EditionStructure) {
    let counter = 0;
    const result = this.getDocumentApparatusEntries(editionStructure.pages);
    result.apps.forEach((value, key) => {
      editionStructure.documentApparatusEntries.apps.set(key, value);
    });

    const enumerateBy = AppConfig.evtSettings.edition.exponentEnumerateBy;
    const enumeratedByJsonElements: string[] = [];
    if (enumerateBy) {
      const enumeratedByElements = Array.from(source.querySelectorAll(enumerateBy));
      for (let enumeratedByElement of enumeratedByElements) {
        const enumeratedByParsed = this.genericParserService.parse(enumeratedByElement as XMLElement);
        const enumerateByJson = JSON.stringify(enumeratedByParsed);
        enumeratedByJsonElements.push(enumerateByJson);
      }
    }

    const resetCounterCallback: (item: GenericElement, enumerateBy: string[]) => void
      = enumerateBy ? (item) => resetCounter(item, enumeratedByJsonElements)
        : (_) => { };
    for (let i = 0; i < editionStructure.pages.length; i++) {
      const page = editionStructure.pages[i];
      this.addApparatusExponents(
        page.parsedContent,
        (app, exponent) => onApparatusEntryReplaced(page, app, exponent),
        () => exponentLabelFactory(this.alphabetService),
        (item) => resetCounterCallback(item, enumeratedByJsonElements)
      );
    }

    function onApparatusEntryReplaced(page: Page, app: ApparatusEntry, exponent: ApparatusEntryExponent): void {
      const exponentId = exponent.id().valueWithoutRef;
      const pageAppEntries = editionStructure.documentApparatusEntries.apps.get(page.id);
      const elementAppEntries = pageAppEntries.apps.get(exponentId);
      if (elementAppEntries) {
        elementAppEntries.apps.push(app);
      }
      else {
        const elementAppEntries: ElementApparatusEntries = {
          elementId: exponentId,
          apps: [app]
        };
        pageAppEntries.apps.set(exponentId, elementAppEntries);
      }
    }

    function exponentLabelFactory(alphabet: AlphabetService): string {
      const label = alphabet.createBase26Label(counter);
      counter++;
      return label;
    }

    function resetCounter(item: GenericElement, enumeratedBy: string[]): void {
      const currentItemJson = JSON.stringify(item);
      const matchesSelector = enumeratedBy.some(x => x === currentItemJson);
      if (enumerateBy !== 'global' && matchesSelector) {
        counter = 0;
      }
    }
  }

  private checkDepaErrors(source: HTMLElement) {
    this.errorService.loadingStart();

    for (const app of this.allApps.filter(x => AppParser.isDepa(x))) {
      const from = Attribute.createFromOrDefault(app);
      if (!from) {
        this.errorService.logError('From attribute is missing:', [app]);
        continue;
      }

      const to = Attribute.createToOrDefault(app);
      if (!to) continue;

      const fromElement = source.querySelector(`[*|id='${from.valueWithoutRef}']`);
      const toElement = source.querySelector(`[*|id='${to.valueWithoutRef}']`);

      if (!fromElement || !toElement) continue;

      // instead of loading all errors right away, this avoid blocking the ui
      setTimeout(() => {
        const otherApps = this.allApps.filter(x => !x.isEqualNode(app));
        for (const otherApp of otherApps) {
          const otherFrom = Attribute.createFromOrDefault(otherApp);
          if (!otherFrom) continue;

          const otherElement = source.querySelector(`[*|id='${otherFrom.valueWithoutRef}']`);
          if (!otherElement) {
            this.errorService.logError(
              `No element found with xml:id ${otherFrom.valueWithoutRef}`,
              [otherApp]
            );
            continue;
          }

          if (isIntersecting(fromElement, toElement, otherElement)) {
            const duplicates = findDuplicateWitnesses(app, otherApp);
            if (duplicates.length) {
              this.errorService.logError(
                `Duplicated witness found in intersecting elements: ${duplicates.join(', ')}`,
                [app, otherApp]
              );
            }
          }
        }
      }, 1);
    }

    this.errorService.loadingEnd();

    function isIntersecting(fromElement: Element, toElement: Element, otherElement: Element) {
      const isAfterFromInclusive = (fromElement.compareDocumentPosition(otherElement) & Node.DOCUMENT_POSITION_FOLLOWING) ||
        otherElement.isEqualNode(fromElement);

      const isBeforeToInclusive = (otherElement.compareDocumentPosition(toElement) & Node.DOCUMENT_POSITION_FOLLOWING) ||
        otherElement.isEqualNode(toElement);

      return isAfterFromInclusive && isBeforeToInclusive;
    }

    function findDuplicateWitnesses(app: HTMLElement, otherApp: HTMLElement): string[] {
      const wit = 'wit';
      const withSelector = `[${wit}]`;
      const exceptParent = 'lem';

      const extractWits = (element: HTMLElement) => Array.from(element.querySelectorAll(withSelector))
        .filter(x => !x.closest(exceptParent))
        .flatMap(x => x.getAttribute(wit)?.split(' ') || []);

      const appWits = extractWits(app);
      const otherAppWits = extractWits(otherApp);

      return findDuplicates([...appWits, ...otherAppWits]);
    }


    function findDuplicates(array: string[]): string[] {
      const uniqueElements = new Set();
      const duplicates = [];

      array.forEach(item => {
        if (uniqueElements.has(item)) {
          duplicates.push(item);
        } else {
          uniqueElements.add(item);
        }
      });

      return duplicates;
    }
  }

  /**
   * This function adds the apparatus exponents on the parsed content of the body
   * based on many different cases for inline and standoff apparatuses.
   * So these exponents are added inline.
   * 
   * @param items the items to be processed.
   * @param onApparatusEntryReplaced callback for adding apparatus entries.
   */
  addApparatusExponents(
    items: any[],
    onApparatusEntryReplaced: (app: ApparatusEntry, exponent: ApparatusEntryExponent) => void,
    getExponentLabel: () => string,
    onShouldResetCounter: (item: GenericElement) => void,
  ) {

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      onShouldResetCounter(item);

      if (item.type?.name === ApparatusEntry.name) {
        const app = item as ApparatusEntry;
        if (!app) throw new Error("Invalid type " + app);

        const callback = (content: any[]) => this.addApparatusExponents(
          content,
          onApparatusEntryReplaced,
          getExponentLabel,
          onShouldResetCounter);
        this.addNestedApparatusExponents(app, callback);

        const id = this.getExponentId();
        const to = id; // the exponent itself as the To element
        let exponent: ApparatusEntryExponent = null;
        if (app.lemma) {
          const from = app.lemma.id; // lemma exist so it will be the From element
          exponent = ApparatusEntryExponent.create(id, from, to, getExponentLabel(), app);
          // the inline apparatus has a lemma so it must be rendered 
          items[i] = app.lemma;
          items.splice(i + 1, 0, exponent);
        } else {
          const from = id; // the exponent itself as the To element, because there is no lemma to render
          exponent = ApparatusEntryExponent.create(id, from, to, getExponentLabel(), app);
          // the inline apparatus has no lemma so we just replace the app with the exponent
          // this is considered an error which handling will be improved in a future feature
          // for now just the exponent is rendered without any preceding text
          items[i] = exponent;
        }
        this.appExponents.set(exponent.id().valueWithoutRef, exponent);
        onApparatusEntryReplaced(item, exponent);
        app.exponent = exponent.label;
      }
      else if (item.type?.name === Anchor.name) {
        const anchorId = item.attributes['id'];
        const apps = this.getApparatusEntriesOrDefault(anchorId);
        if (!apps.length) {
          //console.warn("This anchor has not apparatus entry associated with its id and will be skipped", item);
          continue;
        }

        for (const app of apps) {
          const appFrom = Attribute.createOrDefault(app.attributes[FROM_ATTRIBUTE]);
          if (!appFrom) {
            throw new Error(`A standoff apparatus entry must have a valid ${FROM_ATTRIBUTE} attribute`);
          }

          const appTo = Attribute.createOrDefault(app.attributes[TO_ATTRIBUTE]);
          const isToAnchor = appTo && appTo.equals(anchorId);
          if (!isToAnchor) {
            //console.log("This anchor will be skipped because is the starting anchor, exponent will be place on the ending anchor", item);
            continue;
          }

          const id = this.getExponentId();
          const exponent = ApparatusEntryExponent.create(id, appFrom.valueWithoutRef, appTo.valueWithoutRef, getExponentLabel(), app);
          // insert at index
          items.splice(i + 1, 0, exponent);
          this.appExponents.set(exponent.id().valueWithoutRef, exponent);
          app.exponent = exponent.label;
        }
      }
      // in other cases exponents are added to the items array, so we skip them
      else if (item.type?.name === ApparatusEntryExponent.name) {
        //console.log("The element is an exponent, skipping", item);
        continue;
      }
      else if (item.content) {
        // recursive check for nested entries
        this.addApparatusExponents(item.content, onApparatusEntryReplaced, getExponentLabel, onShouldResetCounter);

        // now check if the item itself has an apparatus entry and add it's exponent as last child
        const itemId = item.attributes['id'];
        const apps = this.getApparatusEntriesOrDefault(itemId);
        if (!apps.length) {
          //console.log("This item has no apparatus entry, skipping", item);
          continue;
        }

        for (const app of apps) {
          const id = this.getExponentId();
          const appFrom = Attribute.createOrDefault(app.attributes[FROM_ATTRIBUTE]);
          const appTo = Attribute.createOrDefault(app.attributes[TO_ATTRIBUTE]);
          const isToElement = appTo && appTo.valueWithoutRef === itemId;
          if (isToElement) {
            const from = appFrom.valueWithoutRef;
            const to = id; // the exponent will be the To element itself since is placed as next sibling of the current item
            const exponent = ApparatusEntryExponent.create(id, from, to, getExponentLabel(), app);
            item.content.push(exponent); // insert as sibling because this component is not an anchor
            this.appExponents.set(exponent.id().valueWithoutRef, exponent);
            app.exponent = exponent.label;
          }
          else if (!appTo) {
            const from = itemId; // from itself since the apparatus entry refer to it
            const to = id; // the exponent will be place as the last child of the element so it marks the end
            const exponent = ApparatusEntryExponent.create(id, from, to, getExponentLabel(), app);
            item.content.push(exponent);
            this.appExponents.set(exponent.id().valueWithoutRef, exponent);
            app.exponent = exponent.label;
          }
        }
      }
      else {
        //console.log('Node is not of interest for apparatus processing', item);
      }
    }
  }

  private addNestedApparatusExponents(app: ApparatusEntry, callback: (content: any[]) => void) {
    const contentValues: ContentValue[] = [];
    this.populateValuesWithContent(app, contentValues);
    for (const value of contentValues) {
      callback(value.content);
    }
  }

  private populateValuesWithContent(obj: any, accumulator: ContentValue[]) {
    const values = Object.values(obj)
      .flatMap(x => x as any)
      .filter(x => typeof (x) === 'object');
    for (let index = 0; index < values.length; index++) {
      const value = values[index];
      if (value.content) {
        accumulator.push(value);
        this.populateValuesWithContent({ content: value.content }, accumulator);
      }
    }
  }

  private getExponentId(): string {
    const uuid = uuidv4();
    return 'app-exponent-' + uuid;
  }

  private getApparatusEntriesOrDefault(id: string): ApparatusEntry[] {
    if (!id) return [];

    let appDatas = this.getAppsData();
    appDatas = appDatas.filter(x => x.appFrom?.valueWithoutRef === id || x.appTo?.valueWithoutRef === id);
    if (!appDatas) return [];

    const apps = []
    for (const appData of appDatas) {
      const app = this.appParser.parse(appData.app);
      apps.push(app as ApparatusEntry);
    }
    return apps;
  }

  private getDocumentApparatusEntries(pages: Page[]): DocumentApparatusEntries {
    const appsData = this.getAppsData();

    const searchValues = appsData.map(x => x.appTo ?? x.appFrom).filter(x => !!x).map(x => x.valueWithoutRef);
    const searchAttribute = "id";
    const attributesNotIncludedInSearch = ['originalEncoding', 'type', 'spanElements', 'includedElements'];

    const documentApparatusEntries = new DocumentApparatusEntries();
    for (const page of pages) {
      const elementAppEntries: Map<string, ElementApparatusEntries> = new Map();
      documentApparatusEntries.apps.set(page.id, {
        pageId: page.id,
        apps: elementAppEntries
      });

      const searchResults = deepSearch(page.parsedContent, searchAttribute, searchValues, 4000, attributesNotIncludedInSearch);
      for (const result of searchResults) {
        const element = result as GenericElement;
        if (!element) continue;

        const elementId = element.attributes[searchAttribute];
        const elementApps = appsData.filter(x => x.appFrom?.equals(elementId) || x.appTo?.equals(elementId));
        const parsedApps = elementApps.map(x => this.appParser.parse(x.app) as ApparatusEntry);
        elementAppEntries.set(elementId, {
          elementId,
          apps: [...parsedApps]
        });
      }
    }
    return documentApparatusEntries;
  }

  private getAppsData(): { app: HTMLElement, appFrom: Attribute, appTo: Attribute }[] {
    return this.allApps
      .map(app => {
        const appFrom = Attribute.createOrDefault(getFromAttributeOrDefault(app));
        const appTo = Attribute.createOrDefault(getToAttributeOrDefault(app));
        return {
          app,
          appFrom,
          appTo,
        };
      });
  }

  parseDocumentPage(imagesSource: ImagesSource, doc: Document, pb: XMLElement, nextPb: XMLElement, ancestorTagName: string): Page {
    /* If there is a next page we retrieve the elements between two page nodes
    otherweise we retrieve the nodes between the page node and the last node of the body node */
    // TODO: check if querySelectorAll can return an empty array in this case
    if (pb.tagName !== 'pb') {
      return {
        id: getID(pb, 'page'),
        label: getNOrDefaultFromElement(pb) || 'page',
        facs: (pb.getAttribute('facs') || 'page').split('#').slice(-1)[0],
        originalContent: [pb],
        parsedContent: this.parsePageContent(doc, [pb]),
        url: this.getPageUrl(imagesSource, getID(pb, 'page')),
        facsUrl: this.getPageUrl(imagesSource, (pb.getAttribute('facs') || getID(pb, 'page')).split('#').slice(-1)[0]),
      };
    }

    const nextNode = nextPb || Array.from(doc.querySelectorAll(ancestorTagName)).reverse()[0].lastChild;
    const originalContent = getElementsBetweenTreeNode(pb, nextNode)
      .filter((n) => !this.structureSeparators.includes(n.tagName))
      .filter((c) => ![4, 7, 8].includes(c.nodeType)); // Filter comments, CDATAs, and processing instructions

    return {
      id: getID(pb, 'page'),
      label: getNOrDefaultFromElement(pb) || 'page',
      facs: (pb.getAttribute('facs') || 'page').split('#').slice(-1)[0],
      originalContent,
      parsedContent: this.parsePageContent(doc, originalContent),
      url: this.getPageUrl(imagesSource, getID(pb, 'page')),
      facsUrl: this.getPageUrl(imagesSource, (pb.getAttribute('facs') || getID(pb, 'page')).split('#').slice(-1)[0]),
    };
  }

  private parseSinglePage(imagesSource: ImagesSource, doc: Document, el: XMLElement, id: string, label: string, facs: string): Page {
    const originalContent: XMLElement[] = getElementsBetweenTreeNode(el.firstChild, el.lastChild);

    return {
      id,
      label,
      facs,
      originalContent,
      parsedContent: this.parsePageContent(doc, originalContent),
      url: this.getPageUrl(imagesSource, id),
      facsUrl: this.getPageUrl(imagesSource, facs || id),
    };
  }

  private processCbRecursive(
    parent: GenericElement,
    children: GenericElement[] = []
  ): boolean {
    for (const child of children) {
      this.processCbRecursive(child, child.content as GenericElement[]);
    }

    if (!children?.length) return false;
    if (!children.some(x => x.type.name === Cb.name)) return;

    const firstRealIndex = children.findIndex(c => !this.isIgnorableNode(c));
    if (children[firstRealIndex]?.type.name !== Cb.name) {
      throw new Error("First real element must be <cb/>");
    }

    const cbIndexes = children
      .map((c, i) => c.type?.name === Cb.name ? i : -1)
      .filter(i => i !== -1);
    if (!cbIndexes.length) return false;

    const columns: GenericElement[] = [];
    for (let i = 0; i < cbIndexes.length; i++) {
      const start = cbIndexes[i] + 1;
      const end = cbIndexes[i + 1] ?? children.length;

      const columnChildren = children.slice(start, end);

      const div = document.createElement('div');
      div.classList.add('tei-column');

      const parsedDiv = this.divParser.parse(div) as GenericElement;
      parsedDiv.content = columnChildren;

      columns.push(parsedDiv);
    }

    parent.content = columns;

    const columnCount = columns.length;
    parent.attributes = {
      ...parent.attributes,
      style: `
      display: grid;
      grid-template-columns: repeat(${columnCount}, 1fr);
      column-gap: clamp(1.5rem, 4vw, 3rem);
      align-items: start;
    `
    };

    return true;
  }

  private getPageUrl(imagesSource: ImagesSource, id: string) {
    // TODO: check if exists <graphic> element connected to page and return its url
    // TODO: handle multiple version of page
    const image = id.split('.')[0];

    //Nel file_config imagesFolderUrls deve terminare già con uno /
    switch (imagesSource.kind) {
      case 'IiifManifest':
        return `${imagesSource.url}${image}.jpg`;
      case 'EditionXml':
      case 'ExternalXml':
        return `${imagesSource.imagesFolderUrls.single}${image}.jpg`;
      case 'null':
        console.warn(`No image source defined for edition of page ${id}`);
        return null;
    }
  }
  // lbId = '';
  // quando trovi un lbId allora lbId = 'qualcosa'


  parsePageContent(doc: Document, pageContent: OriginalEncodingNodeType[]): Array<ParseResult<GenericElement>> {
    const content = pageContent
      .map((node) => {

        const origEl = getEditionOrigNode(node, doc);
        // issue #228
        // the original line is commented because this function causes the node to be revered at its original state
        // before the pb division, see issue #228 details for further info.
        // for now this quick fix allows a proper text division but we need to investigate exceptions and particular cases
        //const origEl = node;

        if (origEl.nodeName === this.frontTagName || isNestedInElem(origEl, this.frontTagName)) {
          if (this.hasOriginalContent(origEl)) {
            return Array.from(origEl.querySelectorAll(`[type=${this.frontOrigContentAttr}]`))
              .map((c) => this.genericParserService.parse(c as XMLElement));
          }
          if (this.isMarkedAsOrigContent(origEl)) {
            return [this.genericParserService.parse(origEl)];
          }

          return [] as Array<ParseResult<GenericElement>>;
        }

        if (origEl.tagName === 'text' && origEl.querySelectorAll && origEl.querySelectorAll(this.frontTagName).length > 0) {
          return this.parsePageContent(doc, Array.from(origEl.children) as HTMLElement[]);
        }

        return [this.genericParserService.parse(origEl)];
      })
      .reduce((x, y) => x.concat(y), [])
      .filter(c => !this.isIgnorableNode(c as GenericElement));

    content.forEach(c => {
      this.normalizeTree(c as GenericElement);
    });
    return content;
  }

  private normalizeTree(node: GenericElement): void {
    if (!node.content?.length) return;

    node.content = node.content
      .filter(child => !this.isIgnorableNode(child as GenericElement))
      .map(child => {
        this.normalizeTree(child as GenericElement);
        return child;
      });
  }

  hasOriginalContent(el: XMLElement): boolean {
    return el.querySelectorAll(`[type=${this.frontOrigContentAttr}]`).length > 0;
  }

  isMarkedAsOrigContent(el: XMLElement): boolean {
    return el.nodeType !== 3 &&
      (el.getAttribute('type') === this.frontOrigContentAttr ||
        this.hasOriginalContent(el) ||
        isNestedInElem(el, '', [{ key: 'type', value: this.frontOrigContentAttr }])
      );
  }
}



//this function is only momentarily commented, waiting for issue #228 to be better addressed
function getEditionOrigNode(el: XMLElement, doc: Document) {
  if (el.getAttribute && el.getAttribute('xpath')) {
    const path = doc.documentElement.namespaceURI ? el.getAttribute('xpath').replace(/\//g, '/ns:') : el.getAttribute('xpath');
    const xpathRes = doc.evaluate(path, doc, createNsResolver(doc), XPathResult.ANY_TYPE, undefined);

    return xpathRes.iterateNext() as XMLElement;
  }

  return el;
}

interface ContentValue {
  content: any[]
}