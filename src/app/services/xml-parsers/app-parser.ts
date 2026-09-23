import { AppConfig } from 'src/app/app.config';
import { ParserRegister, xmlParser } from '.';
import { AdditionalAttributes, ApparatusEntry, Attribute, CorrespList, GenericElement, Lacuna, Lacunas, Mod, Note, Reading, XMLElement } from '../../models/evt-models';
import { createParsedWhiteSpace, removeSpaces } from '../../utils/xml-utils';
import { AttributeParser, EmptyParser, NoteParser } from './basic-parsers';
import { createParser, getID, Parser, ParseResult } from './parser-models';
import { ISDEPA_ATTRIBUTE, XMLID_ATTRIBUTE } from 'src/app/models/constants';
import { getTopMostAncestor, getXPath } from 'src/app/utils/dom-utils';
import { v4 as uuidv4 } from 'uuid';
import { interleave } from 'src/app/utils/js-utils';

@xmlParser('rdg', RdgParser)
export class RdgParser extends EmptyParser implements Parser<XMLElement> {
    private readingGroupTagName = 'rdgGrp';
    attributeParser = createParser(AttributeParser, this.genericParse);
    noteParser = createParser(NoteParser, this.genericParse);
    lacunaParser = createParser(LacunaParser, this.genericParse);

    public parse(rdg: XMLElement): Reading {
        const attributes = this.attributeParser.parse(rdg);
        const result = {
            type: Reading,
            id: getID(rdg),
            attributes,
            witIDs: this.parseReadingWitnesses(rdg) || [],
            excludedWitIDs: this.parseExcludedWitnesses(rdg),
            content: this.parseAppReadingContent(rdg),
            significant: this.isReadingSignificant(rdg),
            class: rdg.tagName.toLowerCase(),
            varSeq: parseInt(rdg.getAttribute('varSeq')),
            notes: this.parseReadingNotes(rdg),
            lacunas: this.parseLacunas(rdg),
            xPath: getXPath(rdg),
            correspList: CorrespList.create(attributes.corresp)
        };
        return result;
    }

    private parseReadingWitnesses(rdg: XMLElement) {
        return rdg.getAttribute('wit')?.split('#')
            .map((el) => removeSpaces(el))
            .filter((el) => el.length !== 0);
    }

    private parseExcludedWitnesses(rdg: XMLElement) {
        const result = rdg.getAttribute('exclude')?.split('#')
            .map((el) => removeSpaces(el))
            .filter((el) => el.length !== 0);
        return result ?? [];
    }

    private parseAppReadingContent(rdg: XMLElement) {
        return Array.from(rdg.childNodes)
            .map((child: XMLElement) => this.genericParse(child));
    }

    private isReadingSignificant(rdg: XMLElement): boolean {
        const notSignificantReadings = AppConfig.evtSettings.edition.notSignificantVariants;
        let isSignificant = true;

        if (notSignificantReadings.length > 0) {
            isSignificant = this.isSignificant(notSignificantReadings, rdg.attributes);
            if (isSignificant && rdg.parentElement.tagName === this.readingGroupTagName) {
                isSignificant = this.isSignificant(notSignificantReadings, rdg.parentElement.attributes);
            }
        }

        return isSignificant;
    }

    private isSignificant(notSignificantReading: string[], attributes: NamedNodeMap): boolean {
        return !Array.from(attributes).some(({ name, value }) => notSignificantReading.includes(`${name}=${value}`));
    }

    private parseReadingNotes(rdg: XMLElement): Note[] {
        const notes = Array.from(rdg.querySelectorAll('note'))
            .map((note: XMLElement) => this.noteParser.parse(note))
        return notes;
    }

    private parseLacunas(rdg: XMLElement): Lacunas {
        const lacuna = this.lacunaParser.parse(rdg);
        if (!lacuna) return { lacunaStart: null, lacunaEnd: null };

        const result = lacuna.isLacunaStart ? { lacunaStart: lacuna } : { lacunaEnd: lacuna };
        return result;
    }
}

@xmlParser('evt-lacuna-parser', Lacuna)
export class LacunaParser extends EmptyParser implements Parser<XMLElement> {
    private readonly attributeParser = createParser(AttributeParser, this.genericParse);

    parse(reading: HTMLElement): Lacuna | null {
        let isLacunaStart: boolean = false;
        let lacunaElement = reading.getElementsByTagName('lacunaStart')[0];
        if (lacunaElement) {
            isLacunaStart = true;
        } else {
            lacunaElement = reading.getElementsByTagName('lacunaEnd')[0];
            if (lacunaElement) {
                isLacunaStart = false;
            } else {
                return null;
            }
        }

        const id = 'lacuna-' + uuidv4();
        const attributes = this.attributeParser.parse(lacunaElement as HTMLElement)
        const lacunaWitnessIds = attributes?.['wit'] ? attributes['wit'].split(' ')
            : reading.getAttribute('wit')?.split(' ') || [];
        let witnessesIds: string[];
        if (lacunaWitnessIds.length) {
            witnessesIds = lacunaWitnessIds;
        } else {
            console.error('No witness has been found for Lacuna', reading);
            witnessesIds = [];
        }

        return {
            id,
            witnessesIds,
            isLacunaStart,
            content: [],
            attributes,
            type: Lacuna,
            xPath: getXPath(lacunaElement),
        };
    }
}

@xmlParser('evt-apparatus-entry-parser', AppParser)
export class AppParser extends EmptyParser implements Parser<XMLElement> {
    private noteTagName = 'note';
    private appEntryTagName = 'app';
    private readingTagName = 'rdg';
    private lemmaTagName = 'lem';

    attributeParser = createParser(AttributeParser, this.genericParse);
    noteParser = createParser(NoteParser, this.genericParse);
    rdgParser = createParser(RdgParser, this.genericParse);

    public static create() {
        return ParserRegister.get('evt-apparatus-entry-parser');
    }

    public static isDepa(app: HTMLElement): boolean {
        return JSON.parse(app.getAttribute(ISDEPA_ATTRIBUTE)) ?? false;
    }

    public parse(appEntryEl: XMLElement): ApparatusEntry {
        const root = getTopMostAncestor(appEntryEl);
        const attributes = this.attributeParser.parse(appEntryEl);
        const from = Attribute.createOrDefault(attributes.from);
        const to = Attribute.createOrDefault(attributes.to);

        let parseResult: ParseResult<GenericElement>[];
        const lemma = this.parseLemma(appEntryEl);
        const isDepa = AppParser.isDepa(appEntryEl);
        if (isDepa) {
            if (!from) {
                console.error("From attribute is required since isDepa is true", appEntryEl);
                throw new Error();
            }

            const fromEl = root.querySelector(`[*|id='${from.valueWithoutRef}']`) as HTMLElement;
            parseResult = this.createParseResult(from, fromEl, to);
            if (lemma && lemma.content.length === 0) {
                lemma.content = [...parseResult];
            }
        }
        else {
            parseResult = [];
        }

        const readings = this.parseReadings(appEntryEl);
        const allReadings = lemma !== undefined ? [lemma].concat(readings) : readings;
        const changes = lemma !== undefined ? this.orderChanges(allReadings, lemma) : []
        const orderedReadings = Array.from(allReadings).sort((r1, r2) => r1.varSeq - r2.varSeq);

        const appEntryObj = {
            type: ApparatusEntry,
            id: getID(appEntryEl),
            attributes: this.attributeParser.parse(appEntryEl),
            content: [],
            criticalContent: parseResult,
            lemma: lemma,
            readings: readings,
            notes: this.parseAppNotes(appEntryEl),
            originalEncoding: appEntryEl,
            class: appEntryEl.tagName.toLowerCase(),
            nestedAppsIDs: this.getNestedAppsIDs(appEntryEl),
            changes: changes,
            orderedReadings: orderedReadings,
            additionalAttributes: new AdditionalAttributes(),
            exponent: '',
            xPath: getXPath(appEntryEl),
        };
        const appEntry = Object.assign(new ApparatusEntry(), appEntryObj);
        return appEntry;
    }

    private createParseResult(from: Attribute, fromEl: HTMLElement, to: Attribute) {
        let parsedResult: ParseResult<GenericElement>[] = [];
        if (!to) {
            parsedResult.push(this.genericParse(fromEl));
        }
        else {
            const fromParent = fromEl.parentElement;
            if (!fromParent) throw new Error("From parent is required");

            const whiteSpace = createParsedWhiteSpace();
            const elements = Array
                .from(fromParent.children)
                .skipWhile(element => !this.isElementByXmlId(element, from))
                .takeWhile(element => !this.isElementByXmlId(element, to), { includeLastItem: true })
                .map(this.genericParse);
            parsedResult = interleave(elements, whiteSpace);
        }
        return parsedResult;
    }

    private isElementByXmlId(element: Element, attribute: Attribute) {
        const xmlId = element.getAttribute(XMLID_ATTRIBUTE);
        if (!xmlId) {
            const message = 'Element must have an xml id';
            console.error(message, element)
            throw new Error(message);
        }

        return attribute.equals(xmlId);
    }

    private getNestedAppsIDs(app: XMLElement): string[] {
        const nesApps = app.querySelectorAll('app');

        return Array.from(nesApps).map((a: XMLElement) => getID(a));
    }

    private parseAppNotes(appEntry: XMLElement): Note[] {
        const notes = Array.from(appEntry.querySelectorAll(this.noteTagName))
            .map((note: XMLElement) => this.noteParser.parse(note));
        return notes;
    }

    private parseLemma(appEntry: XMLElement): Reading {
        return appEntry.querySelector(`${this.lemmaTagName}`) ?
            this.rdgParser.parse(appEntry.querySelector(`${this.lemmaTagName}`)) : undefined;
    }

    private parseReadings(appEntry: XMLElement): Reading[] {
        return Array.from(appEntry.querySelectorAll(`${this.readingTagName}`))
            .filter((el) => el.closest(this.appEntryTagName) === appEntry)
            .map((rdg: XMLElement) => this.rdgParser.parse(rdg));
    }

    /**
     * This function order readings for varSeq attributes and retrieves lem's first
     * (and hopefully unique) mod element '@change'.
     * This info is useful to mod-component in order to decide when to switch
     * between lemma and reading.
     */
    private orderChanges(readings: Reading[], lemma: Reading): Mod[] {
        const changes = [];
        let lemmaLayer: string;
        Array.from(lemma.content).map((el) => {
            if (el['type'] && el['type'] === Mod) {
                if (el['changeLayer']) {
                    lemmaLayer = el['changeLayer'];
                } else {
                    lemmaLayer = null;
                }
            }
        })
        Array.from(readings).map((reading) => reading.content.map((el) => {
            if (el['type'] && el['type'] === Mod) {
                el['insideApp'] = [true, lemmaLayer];
                changes.push(el);
            }
        }));

        return changes;
    }
}

