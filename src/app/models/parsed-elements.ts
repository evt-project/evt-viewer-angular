import { AttributesMap } from 'ng-dynamic-component';
import { Type } from '@angular/core';
import { OriginalEncodingNodeType } from './evt-models';

export interface GenericElementData {
    type: Type<any>;
    path?: string;
    class?: string;
    attributes: AttributesMap;
    content: GenericElementData[];
}

export type HTMLData = GenericElementData & {
    content: OriginalEncodingNodeType[];
};

export interface TextData extends GenericElementData {
    text: string;
}

export type NoteData = GenericElementData;
export type CommentData = GenericElementData;
