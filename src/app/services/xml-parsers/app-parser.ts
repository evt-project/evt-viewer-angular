import { AppConfig } from 'src/app/app.config';
import { xmlParser } from '.';
import { ApparatusEntry, Mod, Note, Reading, XMLElement } from '../../models/evt-models';
import { getOuterHTML } from '../../utils/dom-utils';
import { removeSpaces } from '../../utils/xml-utils';
import { AttributeParser, EmptyParser, NoteParser } from './basic-parsers';
import { createParser, getID, Parser } from './parser-models';

@xmlParser('rdg', RdgParser)
export class RdgParser extends EmptyParser implements Parser<XMLElement> {
    private readingGroupTagName = 'rdgGrp';
    attributeParser = createParser(AttributeParser, this.genericParse);

    public parse(rdg: XMLElement): Reading {
        return {
            type: Reading,
            id: getID(rdg),
            attributes: this.attributeParser.parse(rdg),
            witIDs: this.parseReadingWitnesses(rdg) || [],
            content: this.parseAppReadingContent(rdg),
            significant: this.isReadingSignificant(rdg),
            class: rdg.tagName.toLowerCase(),
        };
    }

    private parseReadingWitnesses(rdg: XMLElement) {
        return rdg.getAttribute('wit')?.split('#')
            .map((el) => removeSpaces(el))
            .filter((el) => el.length !== 0);
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

    public parse(appEntry: XMLElement): ApparatusEntry {

        const lemma = this.parseLemma(appEntry);
        const readings = this.parseReadings(appEntry);
        const foundReadings = (lemma !== undefined) ? readings.concat(lemma) : readings;

        return {
            type: ApparatusEntry,
            id: getID(appEntry),
            attributes: this.attributeParser.parse(appEntry),
            content: [],
            lemma: lemma,
            readings: readings,
            notes: this.parseAppNotes(appEntry),
            originalEncoding: getOuterHTML(appEntry),
            class: appEntry.tagName.toLowerCase(),
            nestedAppsIDs: this.getNestedAppsIDs(appEntry),
            changes: (lemma !== undefined) ? this.parseChanges( foundReadings, lemma ) : [],
        };
    }

    private getNestedAppsIDs(app: XMLElement): string[] {
        const nesApps = app.querySelectorAll('app');

        return Array.from(nesApps).map((a: XMLElement) => getID(a));
    }

    private parseAppNotes(appEntry: XMLElement): Note[] {
        const notes = Array.from(appEntry.children)
            .filter(({ tagName }) => tagName === this.noteTagName)
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
     * This function retrieves lem's first (and hopefully unique) mod element '@change'.
     * This info is useful to mod-component in order to decide when to switch
     * between lemma and reading.
     */
    private parseChanges(readings: Reading[], lemma: Reading): Mod[] {
        const changes = [];
        let lemmaLayer: string;
        Array.from(lemma.content).map((el) => {
            if (el['type'] && el['type'] === Mod) {
                if (el['changeLayer']) {
                    lemmaLayer = el['changeLayer'];
                }
            }
        } )
        Array.from(readings).map((reading) => reading.content.map(( el ) => {
            if (el['type'] && el['type'] === Mod) {
                el['insideApp'] = [true, lemmaLayer];
                changes.push(el);
            }
        }));

        return changes;
    }
}
