import { Observable } from 'rxjs';
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
    occurrences$: Observable<NamedEntityOccurrence[]>;
    relations$: Observable<Relation[]>;
    originalEncoding: OriginalEncodingNodeType;
}

export type NamedEntityLabel = string;

export interface NamedEntityInfo extends GenericElementData {
    label: string;
    content: Array<GenericElementData | NamedEntitiesList>;
}

export interface NamedEntityOccurrence {
    pageId: string;
    pageLabel: string;
    refsByDoc: NamedEntityOccurrenceRef[];
}
export interface NamedEntityOccurrenceRef {
    docId: string;
    docLabel: string;
    refs: GenericElementData[];
}

export interface Relation extends GenericElementData {
    name?: string;
    activeParts: string[]; // Pointers to entities involved in relation
    mutualParts: string[]; // Pointers to entities involved in relation
    passiveParts: string[]; // Pointers to entities involved in relation
    description: Description;
    relationType?: string;
}

export type Description = GenericElementData[];

export interface NamedEntityRefData extends GenericElementData {
    entityId: string;
    entityType: NamedEntityType;
}

export interface WitnessesData {
    witnesses: Map<Witness>;
    groups: Map<WitnessGroup>;
}

export interface Witness {
    id: string;
    name: GenericElementData[];
    attributes: AttributesData;
    content: GenericElementData[];
    groupId: string;
}

export interface WitnessGroup {
    id: string;
    name: string;
    attributes: AttributesData;
    witnesses: string[];
    groupId: string;
}

export interface GridItem {
    url: string;
    name: string;
    active: boolean;
}
interface CommonBibl {
    citedRange?: string;
    note: string;
    ptr?: string;
    ref?: string;
    relatedItem?: string;
    series: string;
}

interface BiblTagCitation extends CommonBibl {
    abbr: string;
    add: string;
    address: string;
    author: string;
    bibl: BiblTagCitation | string;
    biblScope: string;
    cb: string;
    choice: string;
    corr: string;
    date: Date | string;
    del: string;
    distinct: string;
    editor: string;
    email: string;
    emph: string;
    expan: string;
    foreign: string;
    gap: string;
    gb: string;
    gloss: string;
    hi: string;
    index: string;
    lb: string;
    measure: string;
    measureGrp: string;
    meeting: string;
    mentioned: string;
    milestone: string;
    name: string;
    num: number | string;
    orig: string;
    pb: string;
    pubPlace: string;
    publisher: string;
    reg: string;
    respStmt: string;
    rs: string;
    sic: string;
    soCalled: string;
    term: string;
    textLang: string;
    time: Date | string;
    title: string;
    unclear: string;
    unit: string;
}

interface BiblStructTagCitation extends CommonBibl {
    analyticAuthor: string;
    analyticTitle: string;
    monogrAuthor: string;
    monogrTitle: string;
    monogrEditor: string;
    monogrImprintPubPlace: string;
    monogrImprintPublisher: string;
    monogrImprintDate: Date | string;
    monogrBiblScope: string;
}

export type BibliographicCitation = string | BiblStructTagCitation | BiblTagCitation;
