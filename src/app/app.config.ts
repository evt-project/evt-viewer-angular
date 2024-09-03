import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { EntitiesSelectItemGroup } from './components/entities-select/entities-select.component';
import { AnalogueClass, SourceClass, ViewMode, ViewModeId } from './models/evt-models';
import { Attributes, EditorialConventionLayout } from './models/evt-models';
import { updateCSS } from './utils/dom-utils';

@Injectable()
export class AppConfig {
    static evtSettings: EVTConfig;
    private readonly uiConfigUrl = 'assets/config/ui_config.json';
    private readonly fileConfigUrl = 'assets/config/file_config.json';
    private readonly editionConfigUrl = 'assets/config/edition_config.json';
    private readonly editorialConventionsConfigUrl = 'assets/config/editorial_conventions_config.json';

    constructor(
        public translate: TranslateService,
        private http: HttpClient,
    ) { }

    load() {
        return new Promise<void>((resolve) => {
            this.http.get<FileConfig>(this.fileConfigUrl).pipe(
                switchMap((files: FileConfig) => forkJoin([
                    this.http.get<UiConfig>(files.configurationUrls?.ui ?? this.uiConfigUrl),
                    this.http.get<EditionConfig>(files.configurationUrls?.edition ?? this.editionConfigUrl),
                    this.http.get<EditorialConventionsConfig>(
                        files.configurationUrls?.editorialConventions ?? this.editorialConventionsConfigUrl),
                ]).pipe(
                    map(([ui, edition, editorialConventions]) => {
                        console.log(ui, edition, files);
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

                        return { ui, edition, files, editorialConventions };
                    }),
                )),
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
        rules['.edition-font'] = `font-family: ${ui.mainFontFamily}; font-size: ${ui.mainFontSize};`;
        rules['.app-detail-tabs .nav-link'] = `font-family: ${ui.secondaryFontFamily};`;
        rules['.ui-font'] = `font-family: ${ui.secondaryFontFamily}; font-size: ${ui.secondaryFontSize};`;
        rules['.app-detail-tabs'] = `font-family: ${ui.secondaryFontFamily};`;
        rules['.' + AnalogueClass + ' .opened'] = `background-color: ${edition.readingColorDark};`;
        rules['.' + SourceClass + ' .opened'] = `background-color: ${edition.readingColorDark};`;
        rules['.' + AnalogueClass + ':hover'] = `background-color: ${edition.readingColorLight}; cursor:pointer;`;
        rules['.' + SourceClass + ':hover'] = `background-color: ${edition.readingColorLight}; cursor:pointer;`;
        Object.entries(rules).forEach(([selector,style]) => { updateCSS([[selector,style]]) });
    }

}

export interface EVTConfig {
    ui: UiConfig;
    edition: EditionConfig;
    files: FileConfig;
    editorialConventions: EditorialConventionsConfig;
}

export interface UiConfig {
    availableViewModes: ViewMode[];
    localization: boolean;
    defaultLocalization: string;
    availableLanguages: Array<{
        code: string;
        label: string;
        enable: boolean;
    }>;
    enableNavBar: boolean;
    initNavBarOpened: boolean;
    thumbnailsButton: boolean;
    viscollButton: boolean;
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
    theme: 'neutral' | 'modern' | 'classic';
    syncZonesHighlightButton: boolean;
}
export type CitingRanges = 'issue' | 'volume' | 'page';
export type BibliographicProperties = 'author'| 'date'| 'title'| 'editor' | 'publication' | 'pubPlace' | 'publisher' | 'doi';
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

export interface EditionConfig {
    editionTitle: string;
    badge: string;
    editionHome: string;
    showLists: boolean;
    downloadableXMLSource: boolean;
    availableEditionLevels: EditionLevel[];
    namedEntitiesLists: Partial<{
        persons: NamedEntitiesListsConfig;
        places: NamedEntitiesListsConfig;
        organizations: NamedEntitiesListsConfig;
        relations: NamedEntitiesListsConfig;
        events: NamedEntitiesListsConfig;
    }>;
    entitiesSelectItems: EntitiesSelectItemGroup[];
    notSignificantVariants: string[];
    defaultEdition: EditionLevelType;
    defaultViewMode: ViewModeId;
    proseVersesToggler: boolean;
    defaultTextFlow: TextFlow;
    verseNumberPrinter: number;
    readingColorLight: string;
    readingColorDark: string;
    externalBibliography: Partial<{
        biblAttributeToMatch: string;
        elementAttributesToMatch: string[];
    }>;
    biblView: Partial<{
		propsToShow: string[];
		showAttrNames: boolean;
		showEmptyValues: boolean;
		inline: boolean;
        commaSeparated: boolean;
        showMainElemTextContent: boolean;
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
    showSubstitutionMarker: boolean;
    multiPageEngineForCriticalEdition: boolean;
    annotatorColors: AnnotatorColors;
    annotationTextType: AnnotationTextType;
}

export interface AnnotatorColors {
    note: string;
    highlights: string[];
}

export type AnnotationTextType = 'annotate' | 'highlight';


export type EditionImagesSources = 'manifest' | 'graphics';

export interface FileConfig {
    editionUrls: string[];
    editionImagesSource: {
        [T in EditionImagesSources]: EditionImagesConfig;
    };
    logoUrl?: string;
    imagesFolderUrls?: {
        single: string;
        double: string;
    };
    configurationUrls?: {
        edition: string;
        ui: string;
        editorialConventions: string;
    };
}

export interface EditionImagesConfig {
    value: string;
    enable: boolean;
}

export interface NamedEntitiesListsConfig {
    defaultLabel: string;
    enable: boolean;
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

export interface CustomEditorialConvention {
    layouts: { // indicate the output style to be assigned for the indicated encoding for each edition level
        [key in EditionLevelType]: EditorialConventionLayout;
    };
    markup: { // Identifies the element depending on its encoding
        element: string;
        attributes: Attributes;
    };
}

export type TextFlow = 'prose' | 'prose_mixed' | 'verses';
