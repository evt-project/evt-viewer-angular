import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { EntitiesSelectItemGroup } from './components/entities-select/entities-select.component';
import { AnalogueClass, SourceClass, ViewMode, ViewModeId } from './models/evt-models';
import { EditorialConventionLayout } from './models/evt-models';
import { reduceCssUnit, updateCSS } from './utils/dom-utils';
import * as yaml from 'js-yaml';
import { isAbsoluteUrl } from './utils/js-utils';

@Injectable()
export class AppConfig {
    static evtSettings: EVTConfig;
    private readonly defaultFileConfigUrl = 'assets/config/config.yaml';
    private readonly editorialConventionsConfigUrl = 'assets/config/editorial_conventions_config.json';
    private readonly hostConfig$: Observable<HostConfig> = this.http.get<HostConfig>("assets/config/host_config.json");
    public readonly fileConfigUrl$: Observable<string> = this.hostConfig$.pipe(
        map(config => config.allowedEVTAASConfigBaseUrls),
        map(allowedUrls => {
            const params = new URLSearchParams(window.location.hash)
            const paramsUrl = params.get("fileConfigUrl");
            if (!paramsUrl || paramsUrl === this.defaultFileConfigUrl) return this.defaultFileConfigUrl;

            const prefixesMatched = allowedUrls.filter(x => paramsUrl.includes(x))
            console.log("matched prefix: " + prefixesMatched)
            if (!prefixesMatched.length) throw new Error(paramsUrl + " not allowed");
            return paramsUrl;
        }),
        shareReplay(1)
    );

    constructor(
        public translate: TranslateService,
        private http: HttpClient,
    ) {
    }

    load() {
        return new Promise<void>((resolve) => {
            this.fileConfigUrl$.pipe(
                switchMap(mainConfigUrl => this.http.get(mainConfigUrl, { responseType: 'text' }).pipe(
                    map((yamlText: string) => {
                        try {
                            const parsed = yaml.load(yamlText) as EVTConfigRaw;
                            return parsed;
                        } catch (e) {
                            console.error('Error parsing YAML config file:', e);
                            throw e;
                        }
                    }),
                    catchError((err) => {
                        alert("Config file not found \n" + err.message);
                        return throwError(() => err);
                    }),
                    switchMap((configFile) => {
                        const { edition, ui, editionTextSourcesConfig } = configFile;

                        edition.mainMenuConfig.downloadLinks?.forEach(x => {
                            if (!isAbsoluteUrl(x.url)) throw new Error(`Donwload link should be absolute: ${x.url}`);
                        });

                        this.updateStyleFromConfig(edition, ui);
                        // Handle default values => TODO: Decide how to handle defaults!!
                        if (ui.defaultLocalization) {
                            if (ui.availableLanguages.find((l) => l.code === ui.defaultLocalization && l.enable)) {
                                this.translate.use(ui.defaultLocalization);
                            } else {
                                const firstAvailableLang = ui.availableLanguages.find((l) => l.enable);
                                if (firstAvailableLang) {
                                    this.translate.use(firstAvailableLang.code);
                                }
                            }
                        }

                        const sourcesRequests = editionTextSourcesConfig.map(sourceConfig =>
                            this.http.get<EditorialConventionsConfig>(
                                sourceConfig.editorialConventionsUrl ?? this.editorialConventionsConfigUrl
                            ).pipe(
                                map(editorialConventionsConfig => {
                                    let imagesSource: ImagesSource = { kind: 'null' };
                                    if (sourceConfig.imagesSources) {
                                        const imagesSources = sourceConfig.imagesSources.filter(x => x.kind !== 'null' && x.enable);
                                        if (imagesSources.length > 1) {
                                            console.error('Only one image source config should be enabled per edition', sourceConfig);
                                            throw new Error();
                                        }

                                        imagesSource = imagesSources[0];
                                        if (imagesSource.kind === 'ExternalXml' || imagesSource.kind === 'IiifManifest')
                                            if (!isAbsoluteUrl(imagesSource.url))
                                                throw new Error(`Url is not absolute: ${imagesSource.url}`);
                                    }

                                    return {
                                        ...sourceConfig,
                                        editorialConventionsConfig,
                                        imagesSource: imagesSource
                                    }
                                })
                            ));
                        return forkJoin(sourcesRequests).pipe(
                            map((editionTextSources: EditionTextSource[]): EVTConfig => ({
                                edition,
                                ui,
                                editionTextSources,
                            }))
                        );
                    }))
                ),
            ).subscribe((evtConfig) => {
                AppConfig.evtSettings = evtConfig;
                console.log('evtConfig', evtConfig);
                resolve();
            });
        });
    }

    /**
     * Update once general css with values from config,
     * this way we don't need to inject a style property in each element
     * @param edition EditionConfig
     */
    updateStyleFromConfig(edition: EditionConfig, ui: UiConfig) {
        const rules = [];
        rules['html'] = `font-size: ${ui.mainFontSize};`;
        rules['.edition-font'] = `font-family: ${ui.mainFontFamily};`;
        rules['.ng-select'] = `font-size: ${ui.secondaryFontSize};`;
        rules['.nav-link'] = `font-size: ${ui.secondaryFontSize} !important;`;
        rules['.tab-content'] = `font-size: ${reduceCssUnit(ui.mainFontSize, 0.75)}`;
        rules['.apparatus-nav .nav-link'] = `font-size: ${reduceCssUnit(ui.mainFontSize, 0.8)} !important;`;
        rules['evt-biblio-list .msIdentifier, .btn-close, .layerMarker, .app-wit'] = `font-size: ${reduceCssUnit(ui.mainFontSize, 0.9)};`;
        rules['.code, .label, .relation-description, .source-detail-btn'] = `font-size: ${reduceCssUnit(ui.mainFontSize, 0.9)};`;
        rules['.mod-layer'] = `font-size: ${reduceCssUnit(ui.mainFontSize, 0.8)};`;
        rules['evt-original-encoding-viewer code'] = `font-size: ${ui.secondaryFontSize};`;
        rules['.app-detail-tabs .nav-link'] = `font-family: ${ui.secondaryFontFamily};`;
        rules['.ui-font'] = `font-family: ${ui.secondaryFontFamily}; font-size: ${ui.secondaryFontSize};`;
        rules['.app-detail-tabs'] = `font-family: ${ui.secondaryFontFamily};`;
        //rules['.app-detail-content'] = `font-family: ${ui.mainFontFamily}; font-size: ${ui.secondaryFontSize};`;
        rules['.' + AnalogueClass + ' .opened'] = `background-color: ${edition.readingColorDark};`;
        rules['.' + SourceClass + ' .opened'] = `background-color: ${edition.readingColorDark};`;
        rules['.' + AnalogueClass + ':hover'] = `background-color: ${edition.readingColorLight}; cursor:pointer;`;
        rules['.' + SourceClass + ':hover'] = `background-color: ${edition.readingColorLight}; cursor:pointer;`;

        Object.entries(rules).forEach(([selector, style]) => { updateCSS([[selector, style]]) });
        console.log('Style applied from config', rules);
    }

    static getListsToParseTagNames(): NamedEntitiesListConfig[] {
        const neLists = AppConfig.evtSettings.edition.namedEntitiesLists || {};
        const enabledLists: NamedEntitiesListConfig[] = Object.keys(neLists)
            .map((i) => neLists[i].enable ? neLists[i] : undefined)
            .filter((ne) => !!ne);
        return enabledLists;
    }

    static getNamedEntityType(tagName: string): string {
        const lists = AppConfig.getListsToParseTagNames();
        const list = lists.find(list =>
            list.listSelector.toLowerCase().includes(tagName.toLowerCase())
            || list.namedEntityType.toLowerCase() === tagName.toLowerCase());
        return list.namedEntityType;
    }
}

export type EVTConfig = Omit<EVTConfigRaw, 'editionTextSourcesConfig'> & {
    editionTextSources: EditionTextSource[];
}

export type EditionTextSource = Omit<EditionTextSourceConfigRaw, "editorialConventionsUrl" | "imagesSources"> & {
    editorialConventionsConfig: EditorialConventionsConfig;
    imagesSource: ImagesSource;
}

// Raw types are for parsing, but then the app doesn't need all properties
type EVTConfigRaw = {
    editionTextSourcesConfig: EditionTextSourceConfigRaw[];
    edition: EditionConfig;
    ui: UiConfig;
}

type EditionTextSourceConfigRaw = {
    url: string;
    enable: boolean;
    friendlyName?: string;
    glossaryUrl?: string;
    imagesSources?: ImagesSource[];
    editorialConventionsUrl: string;
}

export interface UiConfig {
    defaultViewMode: ViewModeId;
    availableViewModes: ViewMode[];
    localization: boolean;
    defaultLocalization: string;
    availableLanguages: Array<{
        code: string;
        label: string;
        enable: boolean;
        iconUrl: string;
    }>;
    enableNavBar: boolean;
    initNavBarOpened: boolean;
    thumbnailsButton: boolean;
    viscollButton: boolean;
    biblTab: Partial<{
        propsToShow: string[];
        showAttrNames: boolean;
        showEmptyValues: boolean;
        inline: boolean;
        commaSeparated: boolean;
        showMainElemTextContent: boolean;
    }>;
    defaultBibliographicStyle: string;
    allowedBibliographicStyles: {
        [key: string]: {
            id: string;
            label: string;
            enabled: boolean;
            propsOrder: BibliographicProperties[];
            properties: BibliographicStyle;
        }
    };
    mainFontFamily: string;
    mainFontSize: string;
    secondaryFontFamily: string;
    secondaryFontSize: string;
    theme: string;
    syncZonesHighlightButton: boolean;
}
export type CitingRanges = 'issue' | 'volume' | 'page';
export type BibliographicProperties = 'author' | 'date' | 'title' | 'editor' | 'publication' | 'pubPlace' | 'publisher' | 'doi';
export type BibliographicStyle = Partial<{
    propsDelimiter: string;
    authorStyle: Partial<{
        forenameInitials: boolean;
        delimiter: string;
        lastDelimiter: string;
        order: Array<'forename' | 'surname'>;
        maxAuthors: string;
    }>;
    publicationStyle: Partial<{
        citingAcronym: 'all' | 'none' | CitingRanges[];
        includeEditor: boolean;
        inBrackets: CitingRanges[];
    }>;
    dateInsidePublication: boolean;
    titleQuotes: boolean;
    emphasized: BibliographicProperties[];
    inBrackets: BibliographicProperties[];
}>;

export interface DownloadLinks {
    label: string;
    url: string;
}

export interface MainMenuConfig {
    downloadableXMLSource: boolean;
    showEntitiesLists: boolean;
    downloadLinks: DownloadLinks[]
}

export interface EditionConfig {
    editionTitle: string;
    badge: string;
    editionHome: string;
    logoUrl?: string;
    defaultEditionLevel: EditionLevelType;
    availableEditionLevels: EditionLevel[];
    mainMenuConfig: MainMenuConfig;
    namedEntitiesLists: Partial<{
        persons: NamedEntitiesListConfig;
        places: NamedEntitiesListConfig;
        organizations: NamedEntitiesListConfig;
        relations: NamedEntitiesListConfig;
        events: NamedEntitiesListConfig;
        entries: NamedEntitiesListConfig;
        objects: NamedEntitiesListConfig;
    }>;
    entitiesOccurrenceSelectors: string[];
    entitiesSelectItems: EntitiesSelectItemGroup[];
    notSignificantVariants: string[];
    proseVersesToggler: boolean;
    defaultTextFlow: TextFlow;
    verseNumberPrinter: number;
    readingColorLight: string;
    readingColorDark: string;
    externalBibliography: Partial<{
        biblAttributeToMatch: string;
        elementAttributesToMatch: string[];
    }>;
    analogueMarkers: string[];
    sourcesExcludedFromListByParent: string[];
    showChangeLayerMarkerInText: boolean;
    showSeparatorBetweenChanges: boolean;
    changeSequenceView: Partial<{
        showVarSeqAttr: boolean;
        showSeqAttr: boolean;
        layerColors: string[];
    }>;
    startingFromDefinitiveLayer: boolean;
    defaultImageZoomLevel: number;
    maxImageZoomLevel: number;
    showSubstitutionMarker: boolean;
    multiPageEngineForCriticalEdition: boolean;
    structureSeparators: string[];
    exponentEnumerateBy: string | 'global';
}

export interface HostConfig {
    allowedEVTAASConfigBaseUrls: string[];
}

export type IiifManifestSource = {
    kind: "IiifManifest"
    url: string;
    enable: boolean;
}

export type ExternalXmlSource = {
    kind: "ExternalXml",
    url: string;
    enable: boolean;
    imagesFolderUrls: ImageFolderUrls
}

export type EditionXmlSource = {
    kind: "EditionXml",
    enable: boolean;
    imagesFolderUrls: ImageFolderUrls;
}

export type ImageFolderUrls = {
    single: string;
    double: string;
}

export type NullSource = {
    kind: 'null';
}

export class ImagesSourceNotSupported extends Error {
    constructor(imagesSource: ImagesSource) {
        super(`Images source is not supported: ${imagesSource.kind}`);
    }
}

export type ImagesSource = IiifManifestSource | ExternalXmlSource | EditionXmlSource | NullSource;

export interface NamedEntitiesListConfig {
    label: string;
    enable: boolean;
    listSelector: string;
    namedEntityType: string;
}

export type EditionLevelType = 'diplomatic' | 'interpretative' | 'critical' | 'changesView';

export interface EditionLevel {
    id: EditionLevelType;
    label: string;
    title?: string;
    enable?: boolean;
    hidden?: boolean;
}

export interface EditorialConventionsConfig {
    [key: string]: CustomEditorialConvention;
}

export interface EditorialConventionAttributes { [key: string]: string[]; }

export interface CustomEditorialConvention {
    layouts: { // indicate the output style to be assigned for the indicated encoding for each edition level
        [key in EditionLevelType]: EditorialConventionLayout;
    };
    markup: { // Identifies the element depending on its encoding
        element: string;
        attributes: EditorialConventionAttributes;
    };
}

export type TextFlow = 'prose' | 'prose_mixed' | 'verses';
