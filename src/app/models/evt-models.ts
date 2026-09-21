import { Type } from '@angular/core';
import { EditionLevelType, EditorialConventionAttributes } from '../app.config';
import { ParseResult } from '../services/xml-parsers/parser-models';
import { getFromAttributeOrDefault, getToAttributeOrDefault } from '../extensions/apparatus.extensions';
import { ISDEPA_ATTRIBUTE } from './constants';
import { ViewerSource } from './evt-polymorphic-models';

export interface EditorialConvention {
    element: string;
    attributes: EditorialConventionAttributes;
    layouts: EditorialConventionLayouts;
}
export type EditorialConventionLayouts = Partial<{ [key in EditionLevelType]: Partial<EditorialConventionLayout> }>;
export interface EditorialConventionLayout {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    style: { [cssProperty: string]: any; }; // List of CSS properties to be assigned to the output element
    pre: string; // Text to be shown before the element
    post: string; // Text to be shown after the element
}

export interface HighlightData {
    highlight: boolean;
    highlightColor: string;
}

/* TODO: semantic and layout attributes should not be in the same property, consider changing to this
    semanticAttributes?: Attributes;  // TEI/XML attributes
    layout?: {
        class?: string;
        style?: string;
        id?: string;
    };
*/
export class GenericElement {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: Type<any>;
    path?: string;
    class?: string;
    attributes: Attributes;
    content: Array<ParseResult<GenericElement>>;
    xPath: string;
    continued?: boolean; // the element started on the previous page, here there is only what follows the page separator
}

export type XMLElement = HTMLElement;
export type OriginalEncodingNodeType = XMLElement;

export interface EditionStructure {
    pages: Page[];
    documentApparatusEntries?: DocumentApparatusEntries;
}

export class DocumentApparatusEntries {
    apps: Map<string, PageApparatusEntries> = new Map();
}

export class PageApparatusEntries {
    pageId: string;
    apps: Map<string, ElementApparatusEntries> = new Map();
}

export class ElementApparatusEntries {
    elementId: string;
    apps: ApparatusEntry[] = [];
}

export type ViewModeId = 'imageOnly' | 'imageImage' | 'readingText' | 'imageText' | 'textText' |
    'collation' | 'textSources' | 'textVersions' | 'documentalMixed' | 'synopticEdition';

export interface ViewMode {
    id: ViewModeId;
    icon: string;
    iconSet?: 'evt' | 'far' | 'fas';
    label: string;
    enable?: boolean;
}

export interface Page {
    id: string;
    label: string;
    facs: string;
    originalContent: OriginalEncodingNodeType[];
    parsedContent: Array<ParseResult<GenericElement>>;
    url: string;
    facsUrl: string;
    isPartOfLacuna?: boolean;
}

export interface ChangeLayerData {
    list: ListChange[],
    layerOrder: string[],
    selectedLayer: string,
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
    objects: {
        lists: NamedEntitiesList[];
        entities: NamedEntity[];
    };
    entries: {
        lists: NamedEntitiesList[];
        entities: NamedEntity[];
    };
}

export interface Attributes { [key: string]: string; }

export class Attribute {
    valueRef: string;
    valueWithoutRef: string;

    private constructor(value: string) {
        if (!value) throw new Error('value is required');

        this.valueWithoutRef = value.withoutSelectorCharacter();
        this.valueRef = value.withSelectorCharacter();
    }

    equals(other: Attribute | string): boolean {
        if (typeof other === 'string') {
            return this.valueWithoutRef === other;
        }
        if (!(other instanceof Attribute)) {
            return false;
        }
        return this.valueWithoutRef === other.valueWithoutRef;
    }

    static create(value: string): Attribute | null {
        return new Attribute(value);
    }

    static createOrDefault(value: string): Attribute | null {
        return value ? new Attribute(value) : null;
    }

    static createFromOrDefault(app: HTMLElement): Attribute | null {
        const from = getFromAttributeOrDefault(app);
        return Attribute.createOrDefault(from);
    }

    static createToOrDefault(app: HTMLElement): Attribute | null {
        const to = getToAttributeOrDefault(app);
        return Attribute.createOrDefault(to);
    }
}

export interface OriginalEncoding {
    originalEncoding: OriginalEncodingNodeType;
}

export class NamedEntitiesList extends GenericElement {
    id: string;
    label: string;
    namedEntityType: string;
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
    namedEntityType: string;
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
    entityType: string;
}

export interface Witness {
    id: string;
    name: string;
    label?: ParseResult<GenericElement>,
    attributes: Attributes;
    content: Array<ParseResult<GenericElement>>;
    witnesses: Witness[],
    anchestorWitnessesIds: string[]
}

export class ApparatusEntry extends GenericElement {
    id: string;
    lemma: Reading;
    readings: Reading[];
    notes: Note[];
    originalEncoding: OriginalEncodingNodeType;
    nestedAppsIDs: string[];
    changes: Mod[];
    orderedReadings: Reading[];

    /**
     * The {@link GenericElement[attributes]} are used to display data
     * so to avoid messing what already works, this property can be used
     * to store additional attributes. 
     */
    additionalAttributes: AdditionalAttributes;
    criticalContent: ParseResult<GenericElement>[];
    exponent: string;

    isWitnessExcluded(witnessId: string): boolean {
        const isWitnessExcluded = this.readings.some(x => x.excludedWitIDs.includes(witnessId));
        return isWitnessExcluded;
    }

    isDepa() {
        const isDepaValue = this.attributes[ISDEPA_ATTRIBUTE];
        return isDepaValue === 'true';
    }
}

export class AdditionalAttributes {
    attributes: Attributes = {};

    get exponentId() {
        return this.attributes['exponent-id'];
    }

    addExponentId(id: string): void {
        this.attributes['exponent-id'] = id;
    }

    has(id: string) {
        const values = Object.values(this.attributes);
        return values.includes(id);
    }
}

export const SourceClass = 'sourceEntry';
export const AnalogueClass = 'analogueEntry';
export const BibliographyClass = 'biblioEntry';
export const NoteClass = 'noteEntry'

export class QuoteEntry extends GenericElement {
    id: string;
    tagName: string;
    text: string;
    sources: BibliographicEntry[] | BibliographicList[];
    extSources: BibliographicEntry[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extElements: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    analogues: any;
    originalEncoding: OriginalEncodingNodeType;
    isInsideCit: boolean;
    quotedText: string[];
    isNoteView: boolean;
    contentToShow: Array<ParseResult<GenericElement>>
    //rend: string;
}

export class BibliographicList extends GenericElement {
    id: string;
    head: string[];
    sources: BibliographicEntry[];
}

export interface AuthorDetail {
    fullName: string;
    forename: string;
    forenameInitials: string;
    surname: string;
    nameLink: string[];
}
export class BibliographicEntry extends GenericElement {
    id: string;
    author: string[];
    authorsDetails: AuthorDetail[];
    editor: string[];
    title: string[];
    titleDetails: {
        title: string;
        level: string;
    };
    publication: string;
    idno: string[];
    doi: string;
    date: string[];
    publisher: string[];
    pubPlace: string[];
    citedRange: string[];
    pageNumber: string;
    volumeNumber: string;
    issueNumber: string;
    biblScope: string[];
    text: string;
    quotedText: string;
    isInsideCit: boolean;
    originalEncoding: OriginalEncodingNodeType;
}

export class BibliographicStructEntry extends GenericElement {
    id: string;
    analytic: BibliographicEntry[];
    monogrs: BibliographicEntry[];
    series: BibliographicEntry[];
    originalEncoding: OriginalEncodingNodeType;
}

export class Analogue extends GenericElement {
    id: string;
    text: string;
    sources: BibliographicEntry[];
    extSources: BibliographicEntry[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extLinkedElements: any;
    quotedElements: [{ id: string, quote: string }];
    contentToShow: Array<ParseResult<GenericElement>>
    originalEncoding: OriginalEncodingNodeType;
}

export class Reading extends GenericElement {
    id: string;
    witIDs: string[];
    excludedWitIDs: string[];
    significant: boolean;
    varSeq?: number;
    notes: Note[];
    lacunas: Lacunas;
    correspList: CorrespList;
}

export class CorrespList {
    corresps: Corresp[] = [];

    private constructor(public value: string) {
        if(!value) return;
        const correspValues = value.split(" ");
        for (const correspValue of correspValues) {
            const corresp = Corresp.createOrDefault(correspValue);
            if (corresp) this.corresps.push(corresp);
        }
    }

    static create(value: string): CorrespList {
        return new CorrespList(value);
    }
}

export class Corresp {
    editionId: string;
    correspIds: string[] = [];

    private constructor(public value: string) {
        const parts = value.split(':');
        this.editionId = parts[0];

        const lastPart = parts[1];
        const isRange = lastPart.toLowerCase().startsWith("range");
        if (isRange) {
            const valueBetweenParenthesis = lastPart.match(/\(([^)]*)\)/)[1];
            const values = valueBetweenParenthesis.split(",");
            this.correspIds.push(...values);
        }
        else {
            this.correspIds.push(lastPart);
        }
        // cv188:range(CV188_w_002-025,CV188_w_002-026) ce34-5:range(CE34-5_w_002-025,CE34-5_w_002-026)
        // cv188:CV188_w_002-025 cv188:CV188_w_002-026
    }

    static createOrDefault(value: string): Corresp {
        return value ? new Corresp(value) : null;
    }
}

export class Lacunas {
    lacunaStart?: Lacuna;
    lacunaEnd?: Lacuna;
}

export interface LacunaPair {
    start?: HTMLElement;
    end?: HTMLElement;
}

export class Lacuna extends GenericElement {
    id: string;
    witnessesIds: string[];
    isLacunaStart: boolean;
}

export interface GridItem {
    id: string;
    url: string;
    name: string;
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
    source: QuoteEntry;
    analogue: Analogue;
}

export class Paragraph extends GenericElement {
    n: string;
    source: QuoteEntry;
    analogue: Analogue;
}

export class Cb extends GenericElement {
    id: string;
    n?: string;
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

export class Facsimile extends GenericElement {
    corresp: string | undefined;
    surfaces: Surface[];
    surfaceGrps: SurfaceGrp[];
    graphics: Graphic[];
}

export class SurfaceGrp extends GenericElement {

    surfaces: Surface[];
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
    source: QuoteEntry;
    analogue: Analogue;
}

export class VersesGroup extends GenericElement {
    n: string;
    groupType: string;
    source: QuoteEntry;
    analogue: Analogue;
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

export class Subst extends GenericElement {
    //after: ParseResult<GenericElement>;
    del: Deletion;
    add: Addition;
}


export type PlacementType = 'above' | 'below' | 'inline' | 'left' | 'right' | 'inspace' | 'end' | 'sup' | 'superscript' | 'sub' | 'under';

export class Addition extends GenericElement {
    place: PlacementType;
}

export class Space extends GenericElement {
    quantity?: number;
    unit?: 'chars' | 'letter';
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

export class MsFrag extends GenericElement {
    additional: Additional;
    altIdentifier: AltIdentifier;
    history: History;
    msContents: MsContents;
    msIdentifier: MsIdentifier;
    physDesc: PhysDesc;
    pEl: Paragraph[];
}

export class MsPart extends MsFrag {
    head: Head;
    msParts: MsPart[];
}

export class MsDesc extends MsPart {
    id: string;
    n: string;
    label: string;
    msFrags: MsFrag[];
}

// TODO: fix classes MsDesc, MsPart and MsFrag

export class Identifier extends GenericElement {
    collection: CollectionEl[];
    idnos: Array<ParseResult<GenericElement>>; // TODO: Add specific type when idno is handled
    regions: Array<ParseResult<GenericElement>>; // TODO: Add specific type when region is handled
    repository: Repository;
    settlements: Array<ParseResult<GenericElement>>; // TODO: Add specific type when settlement is handled
    countries: Array<ParseResult<GenericElement>>; // TODO: Add specific type when country is handled
}

export class AltIdentifier extends Identifier {
    noteEl: Note[];
}

export class MsIdentifier extends Identifier {
    id: string;
    institution: Institution;
    altIdentifier: AltIdentifier[];
    msName: MsName[];
}

export class MsContents extends GenericElement {
    summary: Summary;
    msItem: MsItem[];
    msItemStruct: MsItemStruct;
    pEl: Paragraph[];
    textLangs: Array<ParseResult<GenericElement>>; // TODO: Add specific type when textLang is handled
}

export class PhysDesc extends GenericElement {
    objectDesc: ObjectDesc;
    bindingDesc: BindingDesc;
    decoDesc: DecoDesc;
    handDesc: HandDesc;
    accMat: AccMat;
    additions: Additions;
    musicNotation: MusicNotation;
    scriptDesc: ScriptDesc;
    sealDesc: SealDesc;
    typeDesc: TypeDesc;
    pEl: Paragraph[];
}

export class History extends GenericElement {
    acquisition: Acquisition;
    origin: Origin;
    provenance: Provenance[];
    summary: Summary;
    pEl: Paragraph[];
}

export class Head extends GenericElement {
    place: string;
    rend: string;
    style: string;
    rendition: string;
    n: string;
    facs: string;
    lbEl: Lb[];
    hi: Array<ParseResult<GenericElement>>; // TODO: Add specific type when hi is handled
    title: Array<ParseResult<GenericElement>>; // TODO: Add specific type when title is handled
    origPlace: OrigPlace;
    origDate: OrigDate;
}

export class Institution extends GenericElement {
    country: Array<ParseResult<GenericElement>>; // TODO: Add specific type when country is handled
    region: Array<ParseResult<GenericElement>>; // TODO: Add specific type when region is handled
}

export class Repository extends GenericElement {
    lang: string;
}

export class MsName extends GenericElement {
    name: Array<ParseResult<GenericElement>>; // TODO: Add specific type when idno is handled
    rs: Array<ParseResult<GenericElement>>; // TODO: Add specific type when rs is handled
    gEl: G[];
}

export class CollectionEl extends GenericElement {
    collectionType: string;
}

export class MsItemStruct extends GenericElement {
    n: string;
    defective: boolean;
    authors: Array<ParseResult<GenericElement>>; // TODO: Add specific type when author is handled
    respStmt: Array<ParseResult<GenericElement>>; // TODO: Add specific type when restStmt is handled
    titles: Array<ParseResult<GenericElement>>; // TODO: Add specific type when title is handled
    rubric: Rubric;
    incipit: Incipit;
    quote: QuoteEntry;
    explicit: Explicit;
    finalRubric: FinalRubric;
    colophons: Array<ParseResult<GenericElement>>; // TODO: Add specific type when colophon is handled
    decoNote: DecoNote;
    listBibl: BibliographicList;
    bibl: BibliographicEntry;
    filiation: Filiation[];
    noteEl: Note[];
    textLangs: Array<ParseResult<GenericElement>>; // TODO: Add specific type when textLang is handled
    locus: Locus;
}

export class MsItem extends MsItemStruct {
    docAuthors: Array<ParseResult<GenericElement>>; // TODO: Add specific type when docAuthor is handled
    docTitles: Array<ParseResult<GenericElement>>; // TODO: Add specific type when docTitle is handled
    docImprints: Array<ParseResult<GenericElement>>; // TODO: Add specific type when docImprint is handled
    docDate: Array<ParseResult<GenericElement>>; // TODO: Add specific type when docDate is handled
    locusGrp: LocusGrp;
    gapEl: Gap[];
    msItem: MsItem[];
}

export class Summary extends GenericElement {
    pEl: Paragraph[];
}

export class Acquisition extends GenericElement {
    notBefore: string;
    notAfter: string;
    name: Array<ParseResult<GenericElement>>; // TODO: Add specific type when name is handled
}

export class Origin extends GenericElement {
    notBefore: string;
    notAfter: string;
    evidence: string;
    resp: string;
    origDate: OrigDate;
    origPlace: OrigPlace;
}

export class OrigDate extends GenericElement {
    notBefore: string;
    notAfter: string;
    when: string;
    origDateType: string;
}

export class OrigPlace extends GenericElement {
    key: string;
    origPlaceType: string;
}

export class Provenance extends GenericElement {
    when: string;
}

export class ObjectDesc extends GenericElement {
    form: string;
    layoutDesc: LayoutDesc;
    supportDesc: SupportDesc;
    pEl: Paragraph[];
}

export class LayoutDesc extends GenericElement {
    pEl: Paragraph[];
    ab: Array<ParseResult<GenericElement>>; // TODO: Add specific type when ab is handled
    layout: Layout;
    summary: Summary;
}

export class Layout extends GenericElement {
    columns: number;
    streams: number;
    ruledLines: number;
    writtenLines: number;
    pEl: Paragraph[];
}

export type MaterialValues = 'paper' | 'parch' | 'perg' | 'mixes';

export class SupportDesc extends GenericElement {
    material: MaterialValues;
    pEl: Paragraph[];
    ab: Array<ParseResult<GenericElement>>; // TODO: Add specific type when ab is handled
    extents: Array<ParseResult<GenericElement>>; // TODO: Add specific type when extent is handled
    collation: Collation;
    condition: Condition;
    foliation: Foliation;
    support: Support;
}

export class Condition extends GenericElement {
    pEl: Paragraph[];
}

export class Collation extends GenericElement {
    pEl: Paragraph[];
}

export class Foliation extends GenericElement {
    id: string;
    pEl: Paragraph[];
}

export class Support extends GenericElement {
    material: Array<ParseResult<GenericElement>>; // TODO: Add specific type when material is handled
    watermark: Array<ParseResult<GenericElement>>; // TODO: Add specific type when watermark is handled
}

export class BindingDesc extends GenericElement {
    binding: Binding[];
    condition: Array<ParseResult<GenericElement>>; // TODO: Add specific type when condition is handled
    decoNote: DecoNote[];
    pEl: Paragraph[];
}

export class Binding extends GenericElement {
    contemporary: boolean;
    condition: Array<ParseResult<GenericElement>>; // TODO: Add specific type when condition is handled
    decoNote: DecoNote[];
    pEl: Paragraph[];
    ab: Array<ParseResult<GenericElement>>; // TODO: Add specific type when ab is handled
}

export class DecoDesc extends GenericElement {
    decoNote: DecoNote;
    pEl: Paragraph[];
    ab: Array<ParseResult<GenericElement>>; // TODO: Add specific type when ab is handled
    summary: Summary;
}

export class Additions extends GenericElement {
    pEl: Paragraph[];
}

export class HandDesc extends GenericElement {
    hands: string;
    handNote: HandNote[];
}

export class ScriptDesc extends GenericElement {
    scriptNote: Array<ParseResult<GenericElement>>; // TODO: Add specific type when scriptNote is handled
    summary: Summary;
}

export class Seal extends GenericElement {
    contemporary: boolean;
    sealType: string;
    n: string;
    decoNote: DecoNote;
    pEl: Paragraph[];
    ab: Array<ParseResult<GenericElement>>; // TODO: Add specific type when ab is handled
}

export class SealDesc extends GenericElement {
    seal: Seal;
}

export class TypeDesc extends GenericElement {
    summary: Summary;
    typeNote: TypeNote;
}

export class TypeNote extends GenericElement {
    id: string;
    scope: string;
}

export class MusicNotation extends GenericElement {
    term: Array<ParseResult<GenericElement>>; // TODO: Add specific type when term is handled
}

export class AccMat extends GenericElement {
    pEl: Paragraph[];
}

export class Additional extends GenericElement {
    listBibls: Array<ParseResult<GenericElement>>; // TODO: Add specific type when listBibl is handled
    adminInfo: AdminInfo;
    surrogates: Surrogates;
}

export class AdminInfo extends GenericElement {
    noteEl: Note[];
    availabilities: Array<ParseResult<GenericElement>>; // TODO: Add specific type when listBibl is handled
    custodialHist: CustodialHist;
    recordHist: RecordHist;
}

export class CustodialHist extends GenericElement {
    pEl: Paragraph[];
    ab: Array<ParseResult<GenericElement>>; // TODO: Add specific type when ab is handled
    custEvent?: CustEvent[];
}

export class CustEvent extends GenericElement {
    custEventType: string;
    notBefore: string;
    notAfter: string;
    when: string;
    from: string;
    to: string;
}

export class RecordHist extends GenericElement {
    pEl: Paragraph[];
    changes: Array<ParseResult<GenericElement>>; // TODO: Add specific type when change is handled
    source: Source[];
    ab: Array<ParseResult<GenericElement>>; // TODO: Add specific type when ab is handled
}

export class Source extends GenericElement {
    pEl: Paragraph[];
}

export class Surrogates extends GenericElement {
    bibls: Array<ParseResult<GenericElement>>; // TODO: Add specific type when bibl is handled
    pEl: Paragraph[];
}

export class Rubric extends GenericElement {
    lang: string;
    rend: string;
    lbEl: Lb[];
    locus: Locus;
    stamp: Array<ParseResult<GenericElement>>; // TODO: Add specific type when stamp is handled
}

export class FinalRubric extends GenericElement {
    lbEl: Lb[];
}

export class Incipit extends GenericElement {
    lang: string;
    defective: boolean;
    lbEl: Lb[];
    locus: Locus;
}

export class Explicit extends GenericElement {
    lang: string;
    defective: boolean;
    locus: Locus;
}

export class Locus extends GenericElement {
    scheme: string;
    from: string;
    to: string;
    facs: string;
    target: string;
    hi: Array<ParseResult<GenericElement>>; // TODO: Add specific type when hi is handled
    gEl: G[];
    locus: Locus;
}

export class LocusGrp extends GenericElement {
    scheme: string;
    locus: Locus;
}

export class DecoNote extends GenericElement {
    decoNoteType: string;
    watermark: Array<ParseResult<GenericElement>>; // TODO: Add specific type when watermark is handled
}

export class Filiation extends GenericElement {
    filiationType: string;
}

export class Dimensions extends GenericElement {
    dimensionsType: string;
    scope: string;
    extent: string;
    unit: string;
    quantity: number;
    atLeast: number;
    atMost: number;
    min: number;
    max: number;
    height: Height;
    width: Width;
    depth: Depth;
    dim: Dim;
}

export class Height extends GenericElement {
    scope: string;
    extent: string;
    unit: string;
    quantity: number;
    atLeast: number;
    atMost: number;
    min: number;
    max: number;
    gEl: G[];
}

export class Width extends GenericElement {
    scope: string;
    extent: string;
    unit: string;
    quantity: number;
    atLeast: number;
    atMost: number;
    min: number;
    max: number;
    gEl: G[];
}

export class Depth extends GenericElement {
    scope: string;
    extent: string;
    unit: string;
    quantity: number;
    atLeast: number;
    atMost: number;
    min: number;
    max: number;
    gEl: G[];
}

export class Dim extends GenericElement {
    dimType: string;
    scope: string;
    extent: string;
    unit: string;
    quantity: number;
    atLeast: number;
    atMost: number;
    min: number;
    max: number;
    gEl: G[];
}

export class FileDesc extends GenericElement {
    titleStmt: TitleStmt;
    publicationStmt: PublicationStmt;
    sourceDesc: SourceDesc;
    editionStmt?: EditionStmt;
    extent?: Extent;
    seriesStmt?: SeriesStmt;
    notesStmt?: NotesStmt;
}

export class TitleStmt extends GenericElement {
    titles: Array<ParseResult<GenericElement>>; // TODO: Add specific type when title is handled
    subtitles: Array<ParseResult<GenericElement>>; // TODO: Add specific type when subtitle is handled
    authors: Array<ParseResult<GenericElement>>; // TODO: Add specific type when author is handled
    principals: Array<ParseResult<GenericElement>>; // TODO: Add specific type when principal is handled
    respStmts: RespStmt[];
    editors: Array<ParseResult<GenericElement>>; // TODO: Add specific type when editor is handled
    sponsors: Array<ParseResult<GenericElement>>; // TODO: Add specific type when sponsor is handled
    funders: Array<ParseResult<GenericElement>>; // TODO: Add specific type when funder is handled
}

export class RespStmt extends GenericElement {
    responsibility: Resp;
    people: Array<ParseResult<NamedEntityRef>>;
    notes: Note[];
}

export class Resp extends GenericElement {
    normalizedResp: string;
    date: string;
}

export class EditionStmt extends GenericElement {
    structuredData: boolean;
    edition: Array<ParseResult<GenericElement>>; // TODO: Add specific type when edition is handled
    respStmt: RespStmt[];
}

export class PublicationStmt extends GenericElement {
    structuredData: boolean;
    publisher: Array<ParseResult<GenericElement>>; // TODO: Add specific type when publisher is handled
    distributor: Array<ParseResult<GenericElement>>; // TODO: Add specific type when distributor is handled
    authority: Array<ParseResult<GenericElement>>; // TODO: Add specific type when authority is handled
    pubPlace: Array<ParseResult<GenericElement>>; // TODO: Add specific type when pubPlace is handled
    address: Array<ParseResult<GenericElement>>; // TODO: Add specific type when address is handled
    idno: Array<ParseResult<GenericElement>>; // TODO: Add specific type when idno is handled
    availability: Array<ParseResult<GenericElement>>; // TODO: Add specific type when availability is handled
    date: Array<ParseResult<GenericElement>>; // TODO: Add specific type when date is handled
    licence: Array<ParseResult<GenericElement>>; // TODO: Add specific type when licence is handled
}

export class SeriesStmt extends GenericElement {
    structuredData: boolean;
    title: Array<ParseResult<GenericElement>>; // TODO: Add specific type when title is handled
    idno: Array<ParseResult<GenericElement>>; // TODO: Add specific type when idno is handled
    respStmt: RespStmt[];
    biblScope: Array<ParseResult<GenericElement>>; // TODO: Add specific type when biblScope is handled
    editor: Array<ParseResult<GenericElement>>; // TODO: Add specific type when editor is handled
}

export class NotesStmt extends GenericElement {
    notes: Note[];
    relatedItems: Array<ParseResult<GenericElement>>; // TODO: Add specific type when relatedItem is handled
}

export class SourceDesc extends GenericElement {
    structuredData: boolean;
    msDescs: MsDesc[];
    bibl: Array<ParseResult<GenericElement>>; // TODO: Add specific type when bibl is handled
    biblFull: Array<ParseResult<GenericElement>>; // TODO: Add specific type when biblFull is handled
    biblStruct: Array<ParseResult<GenericElement>>; // TODO: Add specific type when biblStruct is handled
    recordingStmt: Array<ParseResult<GenericElement>>; // TODO: Add specific type when recordingStmt is handled
    scriptStmt: Array<ParseResult<GenericElement>>; // TODO: Add specific type when scriptStmt is handled
}

export class Extent extends GenericElement { }

export class StyleDefDecl extends GenericElement {
    scheme: string;
    schemeVersion: string;
}

export type VariantEncodingType = 'double-end-point' | 'inline';
export type VariantEncodingLocationType = 'external' | 'internal';

export interface VariantEncoding {
    method: VariantEncodingType;
    location: VariantEncodingLocationType;
}

export class EncodingDesc extends GenericElement {
    structuredData: boolean;
    projectDesc: ProjectDesc[];
    samplingDecl: SamplingDecl[];
    editorialDecl: EditorialDecl[];
    tagsDecl: TagsDecl[];
    styleDefDecl: StyleDefDecl;
    refsDecl: RefsDecl[];
    classDecl: Array<ParseResult<GenericElement>>; // TODO: Add specific type when classDecl is handled
    geoDecl: Array<ParseResult<GenericElement>>; // TODO: Add specific type when geoDecl is handled
    unitDecl: Array<ParseResult<GenericElement>>; // TODO: Add specific type when unitDecl is handled
    schemaSpec: Array<ParseResult<GenericElement>>; // TODO: Add specific type when schemaSpec is handled
    schemaRef: Array<ParseResult<GenericElement>>; // TODO: Add specific type when schemaRef is handled
    variantEncoding: VariantEncoding;
}

export class ProjectDesc extends GenericElement {
    content: Paragraph[];
}

export class SamplingDecl extends GenericElement {
    content: Paragraph[];
}

export type CorrectionStatus = 'high' | 'medium' | 'low' | 'unknown';
export type CorrectionMethod = 'silent' | 'markup';
export class Correction extends ProjectDesc {
    status?: CorrectionStatus;
    method?: CorrectionMethod;
}

export type NormalizationMethod = 'silent' | 'markup';
export class Normalization extends ProjectDesc {
    method: NormalizationMethod;
    sources: string[];
}

export type PunctuationMarks = 'none' | 'some' | 'all';
export type PunctuationPlacement = 'internal' | 'external';
export class Punctuation extends ProjectDesc {
    marks?: PunctuationMarks;
    placement?: PunctuationPlacement;
}

export type QuotationMarks = 'none' | 'some' | 'all';
export class Quotation extends ProjectDesc {
    marks?: QuotationMarks;
}

export type HyphenationEol = 'all' | 'some' | 'hard' | 'none';
export class Hyphenation extends ProjectDesc {
    eol?: HyphenationEol;
}

export class Segmentation extends GenericElement {
    content: Paragraph[];
}

export class StdVals extends GenericElement {
    content: Paragraph[];
}

export class Interpretation extends GenericElement {
    content: Paragraph[];
}

export class EditorialDecl extends GenericElement {
    structuredData: boolean;
    correction: Correction[];
    hyphenation: Hyphenation[];
    interpretation: Interpretation[];
    normalization: Normalization[];
    punctuation: Punctuation[];
    quotation: Quotation[];
    segmentation: Segmentation[];
    stdVals: StdVals[];
}

export type RenditionScope = 'first-line' | 'first-letter' | 'before' | 'after';
export type Scheme = 'css' | 'xslfo' | 'free' | 'other';
export class Rendition extends GenericElement {
    id: string;
    scope?: RenditionScope | string;
    selector?: string;
    scheme?: Scheme;
    schemeVersion?: string;
}

export class TagUsage extends GenericElement {
    gi: string;
    occurs: number;
    withId?: number;
}

export class Namespace extends GenericElement {
    name: string;
    tagUsage: TagUsage[];
}

export class TagsDecl extends GenericElement {
    rendition: Rendition[];
    namespace: Namespace[];
}

export class RefsDecl extends GenericElement {
    structuredData: boolean;
    cRefPattern: CRefPattern[];
    refState: RefState[];
}

export class RefState extends GenericElement {
    ed: string;
    unit: string;
    length: number;
    delim?: string;
}

export class CRefPattern extends GenericElement {
    matchPattern: string;
    replacementPattern: string;
}

export class Abstract extends GenericElement {
    resp: string;
    lang: string;
}

export class Calendar extends GenericElement {
    id: string;
    target: string;
}

export class CalendarDesc extends GenericElement {
    calendars: Calendar[];
}

export type CorrespActionType = 'sent' | 'received' | 'transmitted' | 'redirected' | 'forwarded';
export class CorrespAction extends GenericElement {
    actionType: CorrespActionType | string;
}

export class CorrespContext extends GenericElement { }

export class CorrespDesc extends GenericElement {
    content: Array<CorrespAction | CorrespContext | Note | Paragraph>;
}

export class Creation extends GenericElement { }

export class Language extends GenericElement {
    ident: string;
    usage?: number;
}

export class LangUsage extends GenericElement {
    structuredData: boolean;
    languages: Language[];
}

export class CatRef extends GenericElement {
    scheme?: string;
    target?: string;
}

export class ClassCode extends GenericElement {
    scheme?: string;
}

export class Term extends GenericElement {
    id?: string;
    ref?: string;
    rend?: string;
}

export class Milestone extends GenericElement {
    id?: string;
    unit?: string;
    spanText: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spanElements: any;
}

export class Anchor extends GenericElement {
    id?: string;
}

export class Span extends GenericElement {
    id?: string;
    from: string;
    to: string;
    includedText: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    includedElements: any;
}

export class SpanGrp extends GenericElement {
    id?: string;
    spans: Span[]
}

export class Keywords extends GenericElement {
    scheme?: string;
    terms: Term[];
}

export class TextClass extends GenericElement {
    catRef: CatRef[];
    classCode: ClassCode[];
    keywords: Keywords[];
}

export type HandNoteScope = 'sole' | 'major' | 'minor';
export class HandNote extends GenericElement {
    id: string;
    scribe?: string;
    scribeRef?: string;
    script?: string;
    scriptRef?: string;
    medium?: string;
    scope?: HandNoteScope;
}

export class HandNotes extends GenericElement {
    content: HandNote[];
}

export class Ptr extends GenericElement {
    id?: string;
    target?: string;
    cRef?: string;
    ptrType?: string;
    rend?: string;
}

export class Transpose extends GenericElement {
    content: Ptr[];
}

export class ListTranspose extends GenericElement {
    description: Description[];
    transposes: Transpose[];
}

export type ChannelMode = 's' | 'w' | 'sw' | 'ws' | 'm' | 'x';
export class Channel extends GenericElement {
    mode?: ChannelMode;
}

export class Constitution extends GenericElement {
    constitutionType?: string;
}

export class Derivation extends GenericElement {
    derivationType?: string;
}

export class Domain extends GenericElement {
    domainType?: string;
}

export class Factuality extends GenericElement {
    factualityType?: string;
}

export type ActiveParticipants = 'singular' | 'plural' | 'corporate' | 'unknown';
export type PassiveParticipants = 'self' | 'single' | 'many' | 'group' | 'world';
export class Interaction extends GenericElement {
    interactionType?: string;
    active?: ActiveParticipants | string;
    passive?: PassiveParticipants | string;
}

export class Preparedness extends GenericElement {
    preparednessType?: string;
}

export type Degree = 'high' | 'medium' | 'low' | 'unknown';
export class Purpose extends GenericElement {
    purposeType?: string;
    degree?: Degree;
}

export class TextDesc extends GenericElement {
    channel: Channel[];
    constitution: Constitution[];
    derivation: Derivation[];
    domain: Domain[];
    factuality: Factuality[];
    interaction: Interaction[];
    preparedness: Preparedness[];
    purpose: Purpose[];
}

export class ParticDesc extends GenericElement {
    structuredData: boolean;
    participants: NamedEntitiesList[];
}

export class Setting extends GenericElement {
    who?: string;
    name: GenericElement[]; // TODO: Add specific type when name is handled
    date: GenericElement[]; // TODO: Add specific type when date is handled
    time: GenericElement[]; // TODO: Add specific type when time is handled
    locale: GenericElement[]; // TODO: Add specific type when locale is handled
    activity: GenericElement[]; // TODO: Add specific type when activity is handled
}

export class SettingDesc extends GenericElement {
    structuredData: boolean;
    settings: Setting[];
    places: NamedEntitiesList[];
}

export class ProfileDesc extends GenericElement {
    abstract: Abstract[];
    calendarDesc: CalendarDesc[];
    correspDesc: CorrespDesc[];
    creation: Creation[];
    handNotes: HandNotes[];
    langUsage: LangUsage[];
    listTranspose: ListTranspose[];
    particDesc: ParticDesc[];
    settingDesc: SettingDesc[];
    textClass: TextClass[];
    textDesc: TextDesc[];
}

export type Status = 'approved' | 'candidate' | 'cleared' | 'deprecated' | 'draft' | 'embargoed' | 'expired' |
    'frozen' | 'galley' | 'proposed' | 'published' | 'recommendation' | 'submitted' | 'unfinished' | 'withdrawn';

export class Change extends GenericElement {
    id?: string;
    who?: string;
    status?: Status | string;
    when?: string;
    notBefore?: string;
    notAfter?: string;
    targets?: string[];
}

export class ListChange extends GenericElement {
    content: Array<ListChange | Change>;
    id?: string;
    description?: Description;
    ordered?: boolean;
}

export class Mod extends GenericElement {
    id?: string;
    changeLayer: string;
    varSeq: string;
    isRdg: boolean;
    insideApp: [boolean, string];
    content: Array<ParseResult<GenericElement>>;
    notes: Note[];
    originalEncoding: OriginalEncodingNodeType
}

export class RevisionDesc extends GenericElement {
    content: Array<ListChange | Change>;
    status?: Status | string;
}

export class BibliographyInfo {
    bibliographicEntries: Array<BibliographicEntry | BibliographicStructEntry>;
}

export class ProjectInfo {
    fileDesc: FileDesc;
    encodingDesc: EncodingDesc;
    profileDesc: ProfileDesc;
    revisionDesc: RevisionDesc;
}

export interface ViewerDataValue {
    manifestURL?: string;
    xmlImages?: XMLImagesValues[];
}

export interface XMLImagesValues {
    url: string;
    width?: number;
    height?: number;
}

export interface ViewerDataType {
    source: ViewerSource;
    value: ViewerDataValue;
}

export class ApparatusEntryExponent extends GenericElement {
    /**
     * Avoid calling this directly, use the class factory methods
     * cannot set type if private constructor
     */
    constructor(public label: string, public appEntry: ApparatusEntry) {
        super();
        this.type = ApparatusEntryExponent;
    }

    id(): Attribute {
        return Attribute.create(this.attributes['id']);
    }
    from(): Attribute {
        return Attribute.create(this.attributes['from']);
    }
    to(): Attribute {
        return Attribute.create(this.attributes['to']);
    }

    static create(id: string, from: string, to: string, label: string, appEntry: ApparatusEntry): ApparatusEntryExponent {
        if (!this.isValidId(id))
            throw new Error('id is required');

        if (!this.isValidId(from))
            throw new Error('from is required');

        appEntry.additionalAttributes.addExponentId(id);
        const anchor = new ApparatusEntryExponent(label, appEntry);
        anchor.attributes = {
            'name': 'apparatusEntryAnchor',
            'id': id,
            'from': from,
            'to': to
        };
        return anchor;
    }

    private static isValidId(id: string) {
        return id !== undefined && id !== null && id.length > 0;
    }
}