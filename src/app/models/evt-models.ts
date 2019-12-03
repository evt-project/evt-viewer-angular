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

export interface NamedEntities {
    persons: {
        lists: NamedEntitiesList[];
        entities: NamedEntity[];
    };
    places: {
        lists: NamedEntitiesList[];
        entities: NamedEntity[];
    };
    organizations: {
        lists: NamedEntitiesList[];
        entities: NamedEntity[];
    };
    relations: Relation[];
}

export type AttributesData = Array<{ key: string; value: string }>;

export interface NamedEntitiesList {
    id: string;
    label: string;
    type?: string;
    icon?: string;
    desc?: HTMLElement;
    attributes?: AttributesData;
    sublists?: NamedEntitiesList[];
    entities?: NamedEntity[];
    relations?: Relation[];
    originalEncoding?: HTMLElement; // TODO: evaluate if the assigned type is ok
}

export interface NamedEntity {
    id: string;
    label: string;
    type?: string;
    info?: NamedEntityInfo[];
    attributes?: AttributesData;
    occurrences?: string[]; // TODO: evaluate which type assign
    originalEncoding?: HTMLElement; // TODO: evaluate if the assigned type is ok
}

export interface NamedEntityInfo {
    label: string;
    value: HTMLElement;
    icon?: string;
    attributes?: AttributesData;
}

export interface Relation {
    name?: string;
    activeParts?: string[]; // Pointers to entities involved in relation
    mutualParts?: string[]; // Pointers to entities involved in relation
    passiveParts?: string[]; // Pointers to entities involved in relation
    description?: Element | string;
    type?: string;
    originalEncoding?: HTMLElement; // TODO: evaluate if the assigned type is ok
}
