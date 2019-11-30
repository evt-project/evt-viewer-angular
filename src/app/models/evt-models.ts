import { Map } from '../utils/js-utils';
import { GenericElementData } from './parsed-elements';

export type XMLElement = HTMLElement;
export type OriginalEncodingNodeType = XMLElement;

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

export interface NamedEntitiesList {
    id: string;
    label: string;
    type?: string;
    icon?: string;
    desc?: string;
    attributes?: Array<{key: string; value: string}>;
    sublists?: NamedEntitiesList[];
    entities?: NamedEntity[];
    originalEncoding?: HTMLElement; // TODO: evaluate if the assigned type is ok
}

export interface NamedEntity {
    id: string;
    label: string;
    type?: string;
    info?: NamedEntityInfo[];
    occurrences?: string[]; // TODO: evaluate which type assign
    originalEncoding?: HTMLElement; // TODO: evaluate if the assigned type is ok
}

export interface NamedEntityInfo {
    icon: string;
    text: string;
    label?: string;
}
