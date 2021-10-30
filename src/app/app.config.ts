import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntitiesSelectItemGroup } from './components/entities-select/entities-select.component';
import { ViewMode, ViewModeId } from './models/evt-models';
import { Attributes, EditorialConventionLayout } from './models/evt-models';

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
            forkJoin([
                this.http.get<UiConfig>(this.uiConfigUrl),
                this.http.get<EditionConfig>(this.editionConfigUrl),
                this.http.get<FileConfig>(this.fileConfigUrl),
                this.http.get<EditorialConventionsConfig>(this.editorialConventionsConfigUrl),
            ]).pipe(
                map(([ui, edition, files, editorialConventions]) => {
                    console.log(ui, edition, files);
                    // Handle default values => TODO: Decide how to handle defaults!!
                    if (ui.defaultLocalization) {
                        if (ui.availableLanguages.find((l) => l.code === ui.defaultLocalization && l.enabled)) {
                            this.translate.use(ui.defaultLocalization);
                        } else {
                            const firstAvailableLang = ui.availableLanguages.find((l) => l.enabled);
                            if (firstAvailableLang) {
                                this.translate.use(firstAvailableLang.code);
                            }
                        }
                    }

                    return { ui, edition, files, editorialConventions };
                }),
            ).subscribe(evtConfig => {
                AppConfig.evtSettings = evtConfig;
                console.log('evtConfig', evtConfig);
                resolve();
            });
        });
    }
}
export interface EVTConfig {
    ui: UiConfig;
    edition: EditionConfig;
    files: FileConfig;
    editorialConventions: EditorialConventionsConfig;
}

export interface UiConfig {
    localization: boolean;
    defaultLocalization: string;
    availableLanguages: Array<{
        code: string;
        label: string;
        enabled: boolean;
    }>;
    enableNavBar: boolean;
    initNavBarOpened: boolean;
    thumbnailsButton: boolean;
    viscollButton: boolean;
}

export interface EditionConfig {
    editionTitle: string;
    badge: string;
    editionHome: string;
    showLists: boolean;
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
    availableViewModes: ViewMode[];
    proseVersesToggler: boolean;
    defaultTextFlow: TextFlow;
    verseNumberPrinter: number;
}

export interface FileConfig {
    editionUrls: string[];
    manifestURL: string;
    logoUrl?: string;
}

export interface NamedEntitiesListsConfig {
    defaultLabel: string;
    enabled: boolean;
}
export type EditionLevelType = 'diplomatic' | 'interpretative' | 'critical';
export interface EditionLevel {
    id: EditionLevelType;
    label: string;
    title?: string;
    disabled?: boolean;
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

export type TextFlow = 'prose' | 'verses';
