import { Type } from '@angular/core';
import { ParseResult } from '../services/xml-parsers/parser-models';
import { Map } from '../utils/js-utils';

export class GenericElement {
    // tslint:disable-next-line: no-any
    type: Type<any>;
    path?: string;
    class?: string;
    attributes: Attributes;
    content: Array<ParseResult<GenericElement>>;
}

export type XMLElement = HTMLElement;
export type OriginalEncodingNodeType = XMLElement;

export interface EditionStructure {
    pages: Map<Page>;
    pagesIndexes: string[];
}

export interface Page {
    id: string;
    label: string;
    originalContent: OriginalEncodingNodeType[];
    parsedContent: Array<ParseResult<GenericElement>>;
}

export interface NamedEntities {
    all: {
        lists: NamedEntitiesList[];
        entities: NamedEntity[];
    };
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

export interface Attributes { [key: string]: string; }

export interface OriginalEncoding {
    originalEncoding: OriginalEncodingNodeType;
}

export type NamedEntityType = 'person' | 'place' | 'org' | 'relation' | 'event' | 'generic';
export class NamedEntitiesList extends GenericElement {
    id: string;
    label: string;
    namedEntityType: NamedEntityType;
    description?: Description;
    sublists: NamedEntitiesList[];
    content: NamedEntity[];
    relations: Relation[];
    originalEncoding: OriginalEncodingNodeType;
}

export class NamedEntity extends GenericElement {
    id: string;
    sortKey: string;
    label: NamedEntityLabel;
    namedEntityType: NamedEntityType | 'personGrp';
    content: NamedEntityInfo[];
    originalEncoding: OriginalEncodingNodeType;
}

export type NamedEntityLabel = string;

export class NamedEntityInfo extends GenericElement {
    label: string;
}

export interface NamedEntityOccurrence {
    pageId: string;
    pageLabel: string;
    refsByDoc: NamedEntityOccurrenceRef[];
}
export interface NamedEntityOccurrenceRef {
    docId: string;
    docLabel: string;
    refs: GenericElement[];
}

export class Relation extends GenericElement {
    name?: string;
    activeParts: string[]; // Pointers to entities involved in relation
    mutualParts: string[]; // Pointers to entities involved in relation
    passiveParts: string[]; // Pointers to entities involved in relation
    description: Description;
    relationType?: string;
}

export type Description = Array<ParseResult<GenericElement>>;

export class NamedEntityRef extends GenericElement {
    entityId: string;
    entityType: NamedEntityType;
}

export interface Witnesses {
    witnesses: Map<Witness>;
    groups: Map<WitnessGroup>;
}

export interface Witness {
    id: string;
    name: GenericElement[];
    attributes: Attributes;
    content: Array<ParseResult<GenericElement>>;
    groupId: string;
}

export interface WitnessGroup {
    id: string;
    name: string;
    attributes: Attributes;
    witnesses: string[];
    groupId: string;
}
export class ApparatusEntry extends GenericElement {
    id: string;
    content: Reading[];
    notes: Note[];
    variance: number;
    originalEncoding: string;
}

export class Reading extends GenericElement {
    id: string;
    witIDs: string[];
    significant: boolean;
}

export interface GridItem {
    url: string;
    name: string;
    active: boolean;
}

export type HTML = GenericElement & {
    content: OriginalEncodingNodeType[];
};

export class Text extends GenericElement {
    text: string;
}
export type NoteLayout = 'popover' | 'plain-text';
export class Note extends GenericElement {
    noteLayout: NoteLayout;
    noteType: string;
    exponent: string;
}

export class Paragraph extends GenericElement {
    n: string;
}

export class Lb extends GenericElement {
    id: string;
    n?: string;
    facs?: string; // Needed to handle ITL
    rend?: string;
}

export type Comment = GenericElement;
