import { Injectable } from "@angular/core";
import { map, Observable, shareReplay } from "rxjs";
import { StructureXmlParserService } from "../../services/xml-parsers/structure-xml-parser.service";
import { EVTStatusService } from "../../services/evt-status.service";
import { Attribute as AttributeModel, Page } from "../../models/evt-models";
import { EditionDataService } from "src/app/services/edition-data.service";
import { Attribute, SynopsisEdition } from "./synopsis.models";
import { EditionSource } from "src/app/services/named-entities.service";

@Injectable({
    providedIn: 'root',
})
export class SynopsisService {
    readonly allEditions$: Observable<SynopsisEdition[]> = this.editionDataService.allEditionSources$.pipe(
        map(editionSources => this.mapToSynopsisEdition(editionSources)),
        shareReplay(1));

    constructor(
        private editionDataService: EditionDataService,
        private evtStatusService: EVTStatusService,
        private editionStructureParser: StructureXmlParserService,
    ) {
    }

    getXmlIdsWithCorrespInOtherEditions(editions: HTMLElement[], editionToSkip: HTMLElement, page: Page): string[] {
        const pageId = AttributeModel.create(page.id);
        const xmlIds = page.originalContent
            .flatMap(x => this.recursiveParseAttribute(x, "xml:id"))
            .filter(x => x.value !== pageId.valueWithoutRef); // to skip the page element itself
        const corresps = editions
            .filter(x => x !== editionToSkip)
            .flatMap(x => {
                return this.recursiveParseAttribute(x, "corresp");
            })
            .filter(x => x.value !== pageId.valueRef); // to skip the page element itself
        const result = xmlIds.filter(xmlId =>
            corresps.some(corresp =>  this.matchCorresp(corresp, xmlId.value)));
        return result.map(x => x.value);
    }

    getCorrespPageOrDefault(pages: Page[], xmlId: string): Page | null {
        if (!xmlId) return null;

        const page = pages.find(page => {
            const pageCorresps = page.originalContent.flatMap(x => this.recursiveParseAttribute(x, 'corresp'));
            const containsCorresp = pageCorresps.filter(corresp => this.matchCorresp(corresp, xmlId));
            return containsCorresp.length > 0;
        });
        return page;
    }

    private matchCorresp(corresp: Attribute, xmlId: string) {
        let parts = corresp.value.split(' ').map(x => x.trim());
        parts = parts.flatMap(x => x.split(':'));
        parts = parts.flatMap(x => x.startsWith('#') ? x.substring(1) : x);
        return parts.some(x => x === xmlId);
    }

    getPageElementByAttributeOrDefault(newPage: Page, attribute: Attribute): HTMLElement | null {
        for (const element of newPage.originalContent) {
            const foundElement = this.recursiveFindElementByAttributeOrDefault(element, attribute)
            if (foundElement) return foundElement;
        }

        return null;
    }

    private mapToSynopsisEdition(editionSources: EditionSource[]) {
        const result = editionSources.map(source => {
            const pages = this.editionStructureParser.parsePages(source.editionSource.imagesSource, source.editionData).pages;
            const defaultPage = pages[0];
            const xmlIds = this.getXmlIdsWithCorrespInOtherEditions(
                editionSources.map(x => x.editionData), source.editionData, defaultPage);
            const pageSelectionList = {
                selectedPage: {
                    pageId: defaultPage.id,
                    pageLabel: defaultPage.label
                },
                pages: pages.map(page => ({
                    pageId: page.id,
                    pageLabel: page.label,
                }))
            };
            const editionSource: SynopsisEdition = {
                editionInfo: source.editionInfo,
                editionData: source.editionData,
                pages: pages,
                selectedPage: {
                    page: defaultPage,
                    xmlIds: xmlIds,
                    selectedXmlId: xmlIds[0],
                    pageSelectionList: pageSelectionList
                },
                editionLevel: this.evtStatusService.defaultEditionLevel,
            };
            return editionSource;
        });
        return result;
    }

    private recursiveFindElementByAttributeOrDefault(element: HTMLElement, attribute: Attribute, values: HTMLElement[] = []): HTMLElement | null {
        const result = this.getAttributeOrDefault(element, attribute.key);
        if (result && result.value.includes(attribute.value)) return element;

        if (element.children) {
            for (const child of Array.from(element.children)) {
                const htmlChild = child as HTMLElement;
                const childResult = this.recursiveFindElementByAttributeOrDefault(htmlChild, attribute, values);
                if (childResult) return childResult;
            }
        }

        return null;
    }

    private recursiveParseAttribute(element: HTMLElement, attributeKey: string, values: Attribute[] = []): Attribute[] {
        const attribute = this.getAttributeOrDefault(element, attributeKey);
        if (attribute) values.push(attribute);

        if (element.children) {
            for (const child of Array.from(element.children)) {
                const htmlChild = child as HTMLElement;
                this.recursiveParseAttribute(htmlChild, attributeKey, values);
            }
        }

        return values;
    }

    private getAttributeOrDefault(element: HTMLElement, attributeKey: string): Attribute | null {
        if (element.hasAttribute !== undefined && element.hasAttribute(attributeKey)) {
            const attr = element.getAttribute(attributeKey);
            return { key: attributeKey, value: attr };
        }

        return null;
    }
}

