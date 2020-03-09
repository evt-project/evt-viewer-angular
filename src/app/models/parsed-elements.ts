import { AttributesData, OriginalEncodingNodeType } from './evt-models';

export interface GenericElementData {
    type: string;
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
export type NoteType = 'critical' | 'comment';
export type NoteData = GenericElementData & {
    noteType: NoteType;
    noteExponent: string;
};

export type CommentData = GenericElementData;
