import { ApparatusEntry, Note, Reading, XMLElement } from '../../models/evt-models';
import { getOuterHTML } from '../../utils/dom-utils';
import { removeSpaces } from '../../utils/xml-utils';
import { AttributeParser, EmptyParser, NoteParser } from './basic-parsers';
import { createParser, getID, Parser } from './parser-models';

export class RdgParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);

    public parse(rdg: XMLElement): Reading {
        return {
            type: Reading,
            id: getID(rdg),
            attributes: this.attributeParser.parse(rdg),
            witIDs: this.parseReadingWitnesses(rdg) || [],
            content: this.parseAppReadingContent(rdg),
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
}

export class AppParser extends EmptyParser implements Parser<XMLElement> {
    private noteTagName = 'note';
    private appEntryTagName = 'app';
    private readingTagName = 'rdg';
    private lemmaTagName = 'lem';

    attributeParser = createParser(AttributeParser, this.genericParse);
    noteParser = createParser(NoteParser, this.genericParse);
    rdgParser = createParser(RdgParser, this.genericParse);

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
        return this.rdgParser.parse(appEntry.querySelector(`${this.lemmaTagName}`));
    }

    private parseReadings(appEntry: XMLElement): Reading[] {
        return Array.from(appEntry.querySelectorAll(`${this.readingTagName}`))
            .filter((el) => el.closest(this.appEntryTagName) === appEntry)
            .map((rdg: XMLElement) => this.rdgParser.parse(rdg));
    }
}
