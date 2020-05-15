import { Type } from '@angular/core';
import { AttributesData, OriginalEncodingNodeType } from './evt-models';

export class GenericElementData {
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

export class TextData extends GenericElementData {
    text: string;
}
export type NoteLayout = 'popover' | 'plain-text';
export class NoteData extends GenericElementData {
    noteLayout: NoteLayout;
    noteType: string;
    exponent: string;
}

export class ParagraphData extends GenericElementData {
    n: string;
}

export class LbData extends GenericElementData {
    id: string;
    n?: string;
    facs?: string; // Needed to handle ITL
    rend?: string;
}

export type CommentData = GenericElementData;
