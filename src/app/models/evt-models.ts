import { Type } from '@angular/core';
import { EditionLevelType } from '../app.config';
import { ParseResult } from '../services/xml-parsers/parser-models';
import { Map } from '../utils/js-utils';

export interface EditorialConvention {
    element: string;
    attributes: Attributes;
    layouts: EditorialConventionLayouts;
}
export type EditorialConventionLayouts = Partial<{ [key in EditionLevelType]: Partial<EditorialConventionLayout> }>;
export interface EditorialConventionLayout {
    // tslint:disable-next-line: no-any
    style: { [cssProperty: string]: any; }; // List of CSS properties to be assigned to the output element
    pre: string; // Text to be shown before the element
    post: string; // Text to be shown after the element
}

export interface HighlightData {
    highlight: boolean;
    highlightColor: string;
}

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
    pages: Page[];
}

export type ViewModeId = 'readingText' | 'imageText' | 'textText' | 'collation' | 'textSources' | 'textVersions';

export interface ViewMode {
    id: ViewModeId;
    icon: string;
    iconSet?: 'evt' | 'far' | 'fas';
    label: string;
    disabled?: boolean;
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
    name: string | Array<ParseResult<GenericElement>> | XMLElement;
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
    lemma: Reading;
    readings: Reading[];
    notes: Note[];
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

export class Surface extends GenericElement {
    id: string;
    corresp: string;
    graphics: Graphic[];
    zones: {
        lines: ZoneLine[];
        hotspots: ZoneHotSpot[];
    };
}
export type ZoneRendition = 'Line' | 'HotSpot'; // EVT rule to distinguish lines for ITL from HotSpots
export interface Point {
    x: number;
    y: number;
}
export class Zone extends GenericElement {
    id: string;
    coords: Point[];
    rendition?: ZoneRendition;
    // In lines @corresp points to <lb> @xml:id in the main text; in HotSpots it points to @xml:id of element which contains HS description
    // In Embedded Transcription it is the same as @xml:id of zone itself
    corresp?: string;
    rend?: string;
    rotate?: number;
    surface?: string;
}
export class ZoneLine extends Zone {
    rendition: 'Line';
}
export class ZoneHotSpot extends Zone {
    rendition: 'HotSpot';
}
export class Graphic extends GenericElement {
    url: string;
    height: string;
    width: string;
}

export interface CharMapping {
    type: string;
    subtype: string;
    attributes: Attributes;
    content: Array<ParseResult<GenericElement>>;
}
export interface CharProp {
    name: string;
    value: string;
}
export interface EncodingProp extends CharProp {
    version: string;
}
export class Char extends GenericElement {
    id: string;
    name: string;
    entityName: string;
    localProps: CharProp[];
    mappings: CharMapping[];
    unicodeProp?: EncodingProp;
    unihanProp?: EncodingProp;
    graphics: Graphic[];
}

export class G extends GenericElement {
    id: string;
    charId: string;
}

export type ChoiceType = 'normalization' | 'emendation';
export class Choice extends GenericElement {
    editorialInterventionType: ChoiceType | '';
    originalContent: Array<ParseResult<GenericElement>>;
    normalizedContent: Array<ParseResult<GenericElement>>;
}

export class Verse extends GenericElement {
    n: string;
}

export class VersesGroup extends GenericElement {
    n: string;
    groupType: string;
}

export class Supplied extends GenericElement {
    reason?: string;
    source?: string;
    resp?: string;
}

export type DamageDegree = 'high' | 'medium' | 'low' | 'unknown';
export class Damage extends GenericElement {
    agent: string;
    group?: number;
    degree?: DamageDegree | string; // string representing a number between 0 (undamaged) and 1 (very extensively damaged)
}

export class Surplus extends GenericElement {
    reason?: string;
}

export class Gap extends GenericElement {
    reason?: string;
    agent?: string;
    quantity?: number;
    unit?: string;
    extent?: string;
}

export type PlacementType = 'above' |  'below' |  'inline' |  'left' |  'right' |  'inspace' |  'end' |  'sup' | 'sub' | 'under';

export class Addition extends GenericElement {
    place: PlacementType;
}

export type SicType = 'crux'; // sic types supported in specific ways
export class Sic extends GenericElement {
    sicType?: SicType | string;
}

export class Word extends GenericElement {
    lemma?: string;
}

export class Deletion extends GenericElement {
    rend: string;
}

export class MsDesc extends GenericElement {
    id: string;
    msIdentifier: MsIdentifier;
    head?: Head;
    msContents?: MsContents;
    physDesc?: PhysDesc;
    history?: History;
    additional?: Additional;
    msPart?: MsPart;
    msFrag?: MsFrag;
}

export class MsIdentifier extends GenericElement {
    id: string;
    settlement?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when settlement is handled
    repository?: Repository;
    idno?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when idno is handled
    institution?: Institution;
    altIdentifier?: AltIdentifier;
    msName?: MsName;
    country?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when country is handled
    region?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when region is handled
    collection?: CollectionEl;
}

export class MsContents extends GenericElement {
    summary?: Summary;
    msItem?: MsItem;
    msItemStruct?: MsItemStruct;
}

export class PhysDesc extends GenericElement {
    structuredData: boolean;
    objectDesc?: ObjectDesc;
    bindingDesc?: BindingDesc;
    decoDesc?: DecoDesc;
    handDesc?: HandDesc;
    accMat?: AccMat;
    additions?: Additions;
    musicNotation?: MusicNotation;
    scriptDesc?: ScriptDesc;
    sealDesc?: SealDesc;
    typeDesc?: TypeDesc;
}

export class MsPart extends GenericElement {
    msIdentifier: MsIdentifier;
    msContents?: MsContents;
    physDesc?: PhysDesc;
    msPart?: MsPart;
    additional?: Additional;
    history?: History;
    head?: Head;
}

export class History extends GenericElement {
    acquisition?: Acquisition;
    origin?: Origin;
    provenance?: Provenance;
    summary?: Summary;
}

export class MsFrag extends GenericElement {
    additional?: Additional;
    altIdentifier?: AltIdentifier;
    history?: History;
    msContents?: MsContents;
    msIdentifier?: MsIdentifier;
    physDesc?: PhysDesc;
}

export class Head extends GenericElement {
    place?: string;
    rend?: string;
    style?: string;
    rendition?: string;
    n?: string;
    facs?: string;
    lbEl?: Lb[];
    hi?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when hi is handled
}

export class AltIdentifier extends GenericElement {
    noteEl?: Note[];
    idno?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when idno is handled
    collection?: CollectionEl;
    repository?: Repository;
    region?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when region is handled
    settlement?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when settlement is handled
}

export class Institution extends GenericElement {
    country?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when country is handled
    region?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when region is handled
 }

export class Repository extends GenericElement {
   lang?: string;
}

export class MsName extends GenericElement {
    name?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when idno is handled
    rs?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when rs is handled
    gEl?: G[];
}

export class CollectionEl extends GenericElement {
    collectionType: string;
}

export class MsItemStruct extends GenericElement {
    n?: string;
    class?: string;
    defective?: boolean;
    author?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when author is handled
    restStmt: Array<ParseResult<GenericElement>>; // TODO: Add specific type when restStmt is handled
    title?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when title is handled
    rubric?: Rubric;
    incipit?: Incipit;
    quote?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when quote is handled
    explicit?: Explicit;
    finalRubric?: FinalRubric;
    colophon?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when colophon is handled
    decoNote?: DecoNote;
    listBibl?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when listBibl is handled
    bibl?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when bibl is handled
    filiation?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when filiation is handled
    noteEl?: Note[];
    textLang?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when textLan is handled
    locus?: Locus;
}

export class MsItem extends GenericElement {
    n?: string;
    class?: string;
    defective?: boolean;
    author?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when author is handled
    respStmt?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when respStmt is handled
    rubric?: Rubric;
    incipit?: Incipit;
    title?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when title is handled
    quote?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when quote is handled
    explicit?: Explicit;
    finalRubric?: FinalRubric;
    colophon?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when colophon is handled
    decoNote?: DecoNote;
    listBibl?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when listBibl is handled
    bibl?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when bibl is handled
    filiation?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when filiation is handled
    noteEl?: Note[];
    textLang?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when textLang is handled
    docAuthor?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when docAuthor is handled
    docTitle?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when docTitle is handled
    docImprint?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when docImprint is handled
    docDate?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when docDate is handled
    locus?: Locus;
    locusGrp?: LocusGrp;
    gapEl?: Gap[];
}

export class Summary extends GenericElement {
    pEl?: Paragraph[];
}

export class Acquisition extends GenericElement {
    notBefore?: string;
    notAfter?: string;
    name?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when name is handled
}

export class Origin extends GenericElement {
    notBefore?: string;
    notAfter?: string;
    evidence?: string;
    resp?: string;
    originDate?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when originDate is handled
    originPlace?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when originPlace is handled
}

export class Provenance extends GenericElement {
    when?: string;
}

export class ObjectDesc extends GenericElement {
    form?: string;
    layoutDesc?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when layoutDesc is handled
    supportDesc?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when supportDesc is handled
}

export class BindingDesc extends GenericElement {
    binding?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when binding is handled
    condition?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when condition is handled
    decoNote?: DecoNote;
}

export class DecoDesc extends GenericElement {
    decoNote?: DecoNote;
}

export class Additions extends GenericElement {
    pEl?: Paragraph[];
}

export class HandDesc extends GenericElement {
    hands?: string;
    handNote?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when handNote is handled
}

export class ScriptDesc extends GenericElement {
    scriptNote?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when scriptNote is handled
    summary?: Summary;
}

export class SealDesc extends GenericElement {
    seal?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when seal is handled
}

export class TypeDesc extends GenericElement {
    summary?: Summary;
    typeNote?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when typeNote is handled
}

export class MusicNotation extends GenericElement {
    term?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when term is handled
}

export class AccMat extends GenericElement {
    pEl?: Paragraph[];
}

export class Additional extends GenericElement {
    listBibl?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when term is handled
    adminInfo?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when adminInfo is handled
    surrogates?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when surrogates is handled
}

export class Rubric extends GenericElement {
    lang?: string;
    rend?: string;
    lbEl?: Lb[];
    locus?: Locus;
}

export class FinalRubric extends GenericElement {
    lbEl?: Lb[];
}

export class Incipit extends GenericElement {
    lang?: string;
    defective?: boolean;
    lbEl?: Lb[];
    locus?: Locus;
}

export class Explicit extends GenericElement {
    lang?: string;
    defective?: boolean;
    locus?: Locus;
}

export class Locus extends GenericElement {
    scheme?: string;
    from?: string;
    to?: string;
    facs?: string;
    target?: string;
    hi?: Array<ParseResult<GenericElement>>; // TODO: Add specific type when hi is handled
    gEl?: G[];
    locus?: Locus;
}

export class LocusGrp extends GenericElement {
    scheme?: string;
    locus?: Locus;
}

export class DecoNote extends GenericElement {
    decoNoteType?: string;
}
