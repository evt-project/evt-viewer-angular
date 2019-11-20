import { AttributesMap } from 'ng-dynamic-component';
import { Type } from '@angular/core';

export interface GenericElementData {
    type: Type<any>;
    class?: string;
    content?: ChildNode[];
    path?: string;
    attributes: AttributesMap;
}

export interface HTMLData extends GenericElementData {
    element: HTMLElement;
}

export interface TextData extends GenericElementData {
    text: string;
}

export type NoteData = GenericElementData;
