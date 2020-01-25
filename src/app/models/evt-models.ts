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
    events: {
        lists: NamedEntitiesList[];
        entities: NamedEntity[];
    };
}

export interface AttributesData {
    [key: string]: string;
}

export interface OriginalEncodingData {
    originalEncoding: OriginalEncodingNodeType;
}

export type NamedEntityType = 'person' | 'place' | 'org' | 'relation' | 'event' | 'generic';
export interface NamedEntitiesList extends GenericElementData {
    id: string;
    label: string;
    namedEntityType: NamedEntityType;
    description?: Description;
    sublists: NamedEntitiesList[];
    content: NamedEntity[];
    relations: Relation[];
    originalEncoding: OriginalEncodingNodeType;
}

export interface NamedEntity extends GenericElementData {
    id: string;
    sortKey: string;
    label: NamedEntityLabel;
    namedEntityType: NamedEntityType | 'personGrp';
    content: NamedEntityInfo[];
    occurrences: string[]; // TODO: evaluate which type assign
    originalEncoding: OriginalEncodingNodeType;
}

export type NamedEntityLabel = string;

export interface NamedEntityInfo extends GenericElementData {
    label: string;
    content: Array<GenericElementData | NamedEntitiesList>;
}

export type Relation = OriginalEncodingData & {
    name?: string;
    activeParts: string[]; // Pointers to entities involved in relation
    mutualParts: string[]; // Pointers to entities involved in relation
    passiveParts: string[]; // Pointers to entities involved in relation
    description?: Description | string;
    type?: string;
};

export type Description = GenericElementData[];
export interface WitnessesList {
    witnesses: Map<Witness>;
    originalGroup: Map<WitnessGroup>;
    customGroup?: [];
}

export interface Witness {
    id: string;
    attributes: AttributesData;
    content: Description;
    group: string;
}

export interface WitnessGroup {
    id: string;
    name: string;
    attributes: AttributesData;
    content: string[];
    group?: Description;
}
