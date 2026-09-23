import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { EditionXmlSource, ExternalXmlSource, IiifManifestSource, ImagesSource, ImagesSourceNotSupported } from '../app.config';
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

export abstract class ViewerSource {
    abstract getDataType(data?: Surface[]): ViewerDataType;
    abstract getSource(source: ViewerDataType): ViewerDataInput;
    abstract getTileSource(change: BehaviorSubject<ViewerDataInput>, http?: HttpClient): Observable<OsdTileSource[]>;
}

export class ViewSourceFactory {
    public static create(imagesSource: ImagesSource) {
        switch (imagesSource.kind) {
            case 'IiifManifest':
                return new ManifestSource(imagesSource);
            case 'ExternalXml':
            case 'EditionXml':
                return new EditionSource(imagesSource);
            case 'null':
                throw new ImagesSourceNotSupported(imagesSource)
        }
    }
}

class ManifestSource extends ViewerSource {
    constructor(private imagesSource: IiifManifestSource) {
        super();
    }

    getDataType(): ViewerDataType {
        return {
            source: this,
            value: {
                manifestURL: this.imagesSource.url,
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

class EditionSource extends ViewerSource {
    constructor(private imagesSource: ExternalXmlSource | EditionXmlSource) {
        super();
    }

    getDataType(data: Surface[]): ViewerDataType {
        const imagesFolder = this.imagesSource.imagesFolderUrls.single;
        const xmlImages: XMLImagesValues[] = data.map((s) => {
            const url = s.graphics[0].url;
            if (this.imagesSource.kind === 'ExternalXml') {
                return { url: this.imagesSource.url + imagesFolder + url };
            }
            else {
                const graphic = s.graphics[0];
                if (!graphic) throw new Error('A Graphic object is required');
                
                return {
                    url: imagesFolder + url,
                    width: parseInt(graphic.width),
                    height: parseInt(graphic.height),
                };
            }
        });
        return { source: this, value: { xmlImages } };
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
