import { Type } from '@angular/core';
import { AttributesData, OriginalEncodingNodeType } from './evt-models';

export interface GenericElementData {
    // tslint:disable-next-line: no-any
    type: Type<any>;
    path?: string;
    class?: string;
    attributes: AttributesData;
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
