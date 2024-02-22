import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { AppConfig } from '../app.config';
import { isUrl } from '../utils/js-utils';
import { Surface, ViewerDataType, XMLImagesValues } from './evt-models';

export interface OsdTileSource {
    type?: string;
    '@context'?: string;
    '@id'?: string;
    profile?: [];
    protocol?: string;
    url?: string;
    height: string;
    width: string;
}

export type ViewerDataInput = string | XMLImagesValues[];

interface ViewerSource {
    getDataType(key: string, data?: Surface[]): ViewerDataType;
    getSource(source: ViewerDataType): ViewerDataInput;
    getTileSource(change: BehaviorSubject<ViewerDataInput>, http?: HttpClient): Observable<OsdTileSource[]>;
}

type ViewerConstructors<T> = {
    [K in keyof T]: new () => T[K];
};

class ViewerController<T extends Record<string, ViewerSource>> {
    private factories: T;

    constructor(classes: ViewerConstructors<T>) {
        this.factories = Object.fromEntries(
            Object.entries(classes).map(
                ([key, value]) => ([key, new value()]),
            ),
        ) as T;
    }
    getSource<K extends keyof T>(source: ViewerDataType, type: string | K): ReturnType<T[K]['getSource']> {
        return this.factories[type].getSource(source) as ReturnType<T[K]['getSource']>;
    }
    getTileSource<K extends keyof T>(change: BehaviorSubject<ViewerDataInput>, type: string | K, http?: HttpClient)
        : ReturnType<T[K]['getTileSource']> {
        return this.factories[type].getTileSource(change, http) as ReturnType<T[K]['getTileSource']>;
    }
    getDataType<K extends keyof T>(type: string, data?: Surface[]): ReturnType<T[K]['getDataType']> {
        return this.factories[type].getDataType(type, data) as ReturnType<T[K]['getDataType']>;
    }
}

class ManifestSource {
    getDataType(key: string): ViewerDataType {
        return {
            type: key,
            value: {
                manifestURL: AppConfig.evtSettings.files.editionImagesSource[key].value,
            },
        };
    }

    getSource(source: ViewerDataType): string {
        return source.value.manifestURL;
    }

    getTileSource(change: BehaviorSubject<string>, http: HttpClient): Observable<OsdTileSource[]> {
        return (
            change
                .pipe(
                    filter((url) => !!url),
                    distinctUntilChanged(),
                    switchMap((url) => http.get<{ sequences: Partial<Array<{ canvases }>> }>(url)),
                    map((manifest) => manifest // get the resource fields in the manifest json structure
                        .sequences.map((seq) => seq.canvases.map((canv) => canv.images).reduce((x, y) => x.concat(y), []))
                        .reduce((x, y) => x.concat(y), []).map((res) => res.resource)
                        .map(this.buildTileSource),
                    ),
                )
        );
    }

    buildTileSource(manifestResource) {
        return {
            '@context': manifestResource.service['@context'],
            '@id': manifestResource.service['@id'],
            profile: [manifestResource.service['@profile']],
            protocol: 'http://iiif.io/api/image',
            height: manifestResource.height,
            width: manifestResource.width,
        };
    }
}

class XMLSource {
    getDataType(key: string, data: Surface[]): ViewerDataType {

        const localImagesFolder = AppConfig.evtSettings.files.imagesFolderUrls.single;
        const xmlImages: XMLImagesValues[] = data.map((s) =>
            s[AppConfig.evtSettings.files.editionImagesSource[key].value]
                ? {
                    url: isUrl(s.corresp) ? s.corresp : localImagesFolder + s.corresp,
                } : {
                    width: s[key][0]?.width,
                    height: s[key][0]?.height,
                    url: isUrl(s[key][0]?.url) ? s[key][0]?.url : localImagesFolder + s[key][0]?.url,
                });

        return { type: key, value: { xmlImages } };
    }

    getSource(source: ViewerDataType): XMLImagesValues[] {
        return source.value.xmlImages;
    }

    getTileSource(change: BehaviorSubject<XMLImagesValues[]>): Observable<OsdTileSource[]> {
        return (
            change
                .pipe(
                    map((value) => value.map(this.buildTileSource)),
                )
        );
    }

    buildTileSource(resource) {
        return {
            type: 'image',
            url: resource.url,
            width: resource.width,
            height: resource.height,
        };
    }
}

const ViewerModels = Object.freeze({
    manifest: ManifestSource,
    graphics: XMLSource,
    default: XMLSource,

});

export const ViewerSource = new ViewerController(ViewerModels);
