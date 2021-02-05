import { AppConfig } from 'src/app/app.config';
import { ApparatusEntry, Note, Reading, XMLElement } from '../../models/evt-models';
import { getOuterHTML } from '../../utils/dom-utils';
import { removeSpaces } from '../../utils/xml-utils';
import { AttributeParser, EmptyParser, NoteParser } from './basic-parsers';
import { createParser, getID, Parser } from './parser-models';

export class RdgParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    private readingGroupTagName = 'rdgGrp';

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

export class AppParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    noteParser = createParser(NoteParser, this.genericParse);
    rdgParser = createParser(RdgParser, this.genericParse);

    private noteTagName = 'note';
    private appEntryTagName = 'app';
    private readingTagName = 'rdg';
    private lemmaTagName = 'lem';

    public parse(appEntry: XMLElement): ApparatusEntry {
        return {
            type: ApparatusEntry,
            id: getID(appEntry),
            attributes: this.attributeParser.parse(appEntry),
            content: [],
            lemma: this.parseLemma(appEntry),
            readings: this.parseReadings(appEntry),
            notes: this.parseAppNotes(appEntry),
            originalEncoding: getOuterHTML(appEntry),
            class: appEntry.tagName.toLowerCase(),
        };
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
}
