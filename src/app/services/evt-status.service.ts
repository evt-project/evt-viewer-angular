import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, merge, Observable, Subject, timer } from 'rxjs';
import { distinctUntilChanged, filter, first, map, mergeMap, shareReplay, switchMap, withLatestFrom } from 'rxjs/operators';

import { AppConfig, EditionLevel, EditionLevelType } from '../app.config';
import { ChangeLayerData, Page, ViewMode } from '../models/evt-models';
import { EVTModelService } from './evt-model.service';
import { deepSearch } from '../utils/dom-utils';
import { EditionSource } from './named-entities.service';

export type URLParamsKeys = 'd' | 'ed' | 'p' | 'el' | 'ws' | 'vs' | 'lr' | 'app' | 'corresp';
export type URLParams = { [T in URLParamsKeys]: string };

@Injectable({
    providedIn: 'root',
})
export class EVTStatusService {
    public availableEditionLevels = AppConfig.evtSettings.edition.availableEditionLevels?.filter(((e) => e.enable)) || [];

    get defaultEditionLevel(): EditionLevel {
        const defaultConfig = AppConfig.evtSettings.edition.defaultEditionLevel;
        const availableEditionLevels = AppConfig.evtSettings.edition.availableEditionLevels?.filter(((e) => e.enable)) ?? [];
        return defaultConfig ? availableEditionLevels.find((e) => e.id === defaultConfig)
            : availableEditionLevels[0];
    }

    get defaultEditionLevelId(): EditionLevelType {
        return this.defaultEditionLevel?.id;
    }

    get availableViewModes() {
        return AppConfig.evtSettings.ui.availableViewModes?.filter(((e) => e.enable)) ?? [];
    }
    get defaultViewMode(): ViewMode {
        const defaultConfig = AppConfig.evtSettings.ui.defaultViewMode;
        let defaultViewMode = this.availableViewModes[0];
        if (defaultConfig) {
            defaultViewMode = this.availableViewModes.find((e) => e.id === defaultConfig) ?? defaultViewMode;
        }

        return defaultViewMode;
    }

    public updateViewMode$: BehaviorSubject<ViewMode> = new BehaviorSubject(undefined);
    public updateDocument$: BehaviorSubject<string> = new BehaviorSubject('');
    public updatePage$: Subject<Page> = new Subject();
    public updatePageId$: Subject<string> = new Subject();
    public updatePageNumber$: Subject<number> = new Subject();
    public updateEditionLevels$: Subject<EditionLevelType[]> = new Subject();
    public updateWitnesses$: BehaviorSubject<string[]> = new BehaviorSubject([]);
    public updateVersions$: BehaviorSubject<string[]> = new BehaviorSubject([]);
    public updateChangeLayer$: BehaviorSubject<ChangeLayerData> = new BehaviorSubject(undefined);
    public updateLayer$: BehaviorSubject<string> = new BehaviorSubject(undefined);
    public updateApparatus$: BehaviorSubject<string> = new BehaviorSubject(undefined);
    public updateCorresp$: BehaviorSubject<string> = new BehaviorSubject(undefined);

    public currentViewMode$ = this.updateViewMode$.asObservable();
    public currentDocument$ = merge(
        this.route.queryParams.pipe(map((params: URLParams) => params.d)),
        this.updateDocument$,
    );
    public currentEdition$ = merge(
        this.route.queryParams.pipe(map((params: URLParams) => params.ed)),
        this.evtModelService.updateEditionId$,
    ).pipe(
        mergeMap((editionId) => this.evtModelService.editionSources$.pipe(
            map((editionSources) => !editionId ? editionSources[0]
                : editionSources.find((ed) => ed.editionInfo.editionId === editionId))
        ))
    );
    public currentPage$ = merge(
        merge(
            this.route.queryParams.pipe(map((params: URLParams) => params.p)),
            this.updatePageId$,
        ).pipe(
            mergeMap((id) => this.evtModelService.pages$.pipe(
                map((pages) => !id ? pages[0] : pages.find((p) => p.id === id) || pages[0]),
            )),
        ),
        this.updatePage$.pipe(
            filter((p) => !!p),
        ),
        this.updatePageNumber$.pipe(
            withLatestFrom(this.evtModelService.pages$),
            map(([n, pages]) => n < 0 ? pages[pages.length - 1] : pages[n]),
        ),
    ).pipe(
        distinctUntilChanged((a, b) => a?.id === b?.id)
    );
    
    public currentEditionLevels$ = merge(
        this.route.queryParams.pipe(
            map((params: URLParams) => (params.el?.split(',') ?? [])),
            map((editionLevels) => editionLevels?.length > 0 ? editionLevels : [this.defaultEditionLevelId]),
            map((editionLevels: EditionLevelType[]) => editionLevels.filter((el) => !!el)),
        ),
        this.updateEditionLevels$,
    );
    public currentWitnesses$ = merge(
        this.route.queryParams.pipe(map((params: URLParams) => params.ws?.split(',') ?? [])),
        this.updateWitnesses$,
    );
    public currentVersions$ = merge(
        this.route.queryParams.pipe(map((params: URLParams) => params.vs?.split(',') ?? [])),
        this.updateVersions$,
    );

    public currentApparatus$ = merge(
        this.route.queryParams.pipe(map((params: URLParams) => params.app)),
        this.updateApparatus$,
    );

    public currentCorresp$ = merge(
        this.route.queryParams.pipe(map((params: URLParams) => params.corresp)),
        this.updateCorresp$,
    );

    public currentChanges$ = merge(
        merge(
            //this.route.queryParams.pipe(map((params: URLParams) => params.lr ?? '')),
            this.evtModelService.changeData$,
        ).pipe(
            filter((n) => n !== undefined),
            withLatestFrom(this.updateLayer$),
            map(([data, selectedLayer]) => {
                data.selectedLayer = selectedLayer;

                return data;
            }),
        ),
    );

    public currentStatus$: Observable<AppStatus> = combineLatest([
        this.updateViewMode$,
        this.currentDocument$,
        this.currentEdition$,
        this.currentPage$,
        this.currentEditionLevels$,
        this.currentWitnesses$,
        this.currentVersions$,
        this.currentChanges$,
        this.currentApparatus$,
        this.currentCorresp$,
    ]).pipe(
        distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y)),
        shareReplay(1),
        map(([
            viewMode,
            document,
            edition,
            page,
            editionLevels,
            witnesses,
            versions,
            changeLayerData,
            currentApparatus,
            corresp,
        ]) => {
            if (viewMode.id === 'textText') {
                if (editionLevels.length === 1) {
                    editionLevels.push(this.availableEditionLevels.filter((e) => e.id !== editionLevels[0])[0].id);
                }
            } else if (viewMode.id === 'collation') {
                editionLevels = [];
            } else if (editionLevels.length > 1) {
                editionLevels = editionLevels.slice(0, 1);
            }

            return {
                viewMode,
                document,
                edition,
                page,
                editionLevels,
                witnesses,
                versions,
                changeLayerData,
                currentApparatus,
                corresp
            };
        }),
    );

    public currentNamedEntityId$: BehaviorSubject<string> = new BehaviorSubject(undefined);

    public currentQuotedId$: BehaviorSubject<string> = new BehaviorSubject(undefined);

    public syncImageNavBar$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        private evtModelService: EVTModelService,
        private router: Router,
        private route: ActivatedRoute,
        private appConfig: AppConfig,
    ) {
        combineLatest([
            this.appConfig.fileConfigUrl$,
            this.currentStatus$
        ]).subscribe(([fileConfigUrl, currentStatus]) => {
            const { view, params } = this.getUrlFromStatus(fileConfigUrl, currentStatus);
            if (Object.keys(params).length > 0) {
                this.router.navigate([`/${view}`], { queryParams: params });
            } else {
                this.router.navigate([`/${view}`]);
            }
        });
        this.router.events.pipe(
            filter((event) => event instanceof NavigationStart),
            first(),
        ).subscribe((event: NavigationStart) => {
            const currentViewMode = this.updateViewMode$.getValue();
            if (!currentViewMode) {
                const pathMatch = event.url.match(/(?<!\?.+)(?<=\/)[\w-]+(?=[/\r\n?]|$)/gm);
                if (pathMatch) {
                    this.updateViewMode$.next(this.availableViewModes.find((vm) => vm.id === pathMatch[0]));
                } else {
                    this.updateViewMode$.next(this.defaultViewMode);
                }
            }
        });
        this.currentNamedEntityId$.pipe(
            filter((id) => !!id),
            switchMap((id) => timer(5000).pipe(map(() => id))),
        ).subscribe(() => this.currentNamedEntityId$.next(undefined));
    }

    getUrlFromStatus(fileConfigUrl: string, status: AppStatus) {
        const params = {
            d: status.document || '',
            ed: status.edition?.editionInfo?.editionId || '',
            p: status.page?.id ?? '',
            el: status.editionLevels.join(','),
            ws: status.witnesses.join(','),
            vs: status.versions.join(','),
            lr: status.changeLayerData.selectedLayer,
            fileConfigUrl: fileConfigUrl,
            app: status.currentApparatus,
            corresp: status.corresp
        };
        Object.keys(params).forEach((key) => (params[key] === '') && delete params[key]);

        return {
            view: status.viewMode.id,
            params,
        };
    }

    /** to avoid loops this function must not be fed with nodes */
    getPageElementsByClassList(classList: string[]) {
        const attributesNotIncludedInSearch = ['originalEncoding', 'type', 'spanElements', 'includedElements'];
        const maxEffort = 4000;

        return this.currentStatus$.pipe(
            map(({ page }) => page.parsedContent),
            map((pageSubElements) => deepSearch(pageSubElements, 'class', classList, maxEffort, attributesNotIncludedInSearch)),
        );
    }

}

export interface AppStatus {
    viewMode: ViewMode;
    document: string;
    edition: EditionSource;
    page: Page;
    editionLevels: EditionLevelType[];
    witnesses: string[];
    versions: string[];
    changeLayerData: ChangeLayerData;
    currentApparatus: string;
    corresp: string;
}
