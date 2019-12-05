import { Map } from '../utils/jsUtils';
import { GenericElementData } from './parsed-elements';
export type OriginalEncodingNodeType = ChildNode;

export interface EditionStructure {
    pages: Map<PageData>;
    pagesIndexes: string[];
}

export interface PageData {
    id: string;
    label: string;
    originalContent: OriginalEncodingNodeType[];
    parsedContent: GenericElementData[];
}
