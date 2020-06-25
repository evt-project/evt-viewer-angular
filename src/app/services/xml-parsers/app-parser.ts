import { AppConfig } from '../../app.config';
import { ApparatusEntry, Note, Reading, XMLElement } from '../../models/evt-models';
import { getOuterHTML } from '../../utils/dom-utils';
import { removeSpaces } from '../../utils/xml-utils';
import { AttributeParser, EmptyParser, NoteParser } from './basic-parsers';
import { createParser, getID, Parser } from './parser-models';

export class RdgParser extends EmptyParser implements Parser<XMLElement> {
    private appEntryTagName = 'app';
    attributeParser = createParser(AttributeParser, this.genericParse);

    public parse(rdg: XMLElement): Reading {
        return {
            type: Reading,
            id: getID(rdg),
            attributes: this.attributeParser.parse(rdg),
            witIDs: this.parseReadingWitnesses(rdg) || [],
            content: this.parseAppReadingContent(rdg),
        };
    }

    private parseReadingWitnesses(rdg: XMLElement) {
        return rdg.getAttribute('wit')?.split('#')
            .map((el) => removeSpaces(el))
            .filter((el) => el.length !== 0);
    }

    private parseAppReadingContent(rdg: XMLElement) {
        return Array.from(rdg.childNodes)
            .map((child: XMLElement) => {
                if (child.nodeName === this.appEntryTagName) {
                    return {
                        type: ApparatusEntry,
                        id: getID(child),
                        attributes: {},
                        content: [],
                    };
                }

                return this.genericParse(child);
            });
    }
}

export class LemmaParser extends EmptyParser implements Parser<XMLElement> {
    rdgParser = createParser(RdgParser, this.genericParse);

    public parse(rdg: XMLElement): Reading {
        return this.rdgParser.parse(rdg);
    }
}

export class AppParser extends EmptyParser implements Parser<XMLElement> {
    private noteTagName = 'note';
    private readingTagName = 'rdg';
    private lemmaTagName = 'lem';

    attributeParser = createParser(AttributeParser, this.genericParse);
    noteParser = createParser(NoteParser, this.genericParse);
    rdgParser = createParser(RdgParser, this.genericParse);
    lemmaParser = createParser(LemmaParser, this.genericParse);

    public parse(appEntry: XMLElement): ApparatusEntry {
        const content = this.parseAppReadings(appEntry);

        return {
            type: ApparatusEntry,
            id: getID(appEntry),
            attributes: this.attributeParser.parse(appEntry),
            content,
            notes: this.parseAppNotes(appEntry),
            originalEncoding: getOuterHTML(appEntry),
        };
    }

    private parseAppNotes(appEntry: XMLElement): Note[] {
        const notes = Array.from(appEntry.children)
            .filter(({ tagName }) => tagName === this.noteTagName)
            .map((note: XMLElement) => this.noteParser.parse(note));

        return notes;
    }

    private parseAppReadings(appEntry: XMLElement): Reading[] {
        return Array.from(appEntry.querySelectorAll(`${this.readingTagName}, ${this.lemmaTagName}`))
            .map((rdg: XMLElement) => {
                if (rdg.tagName === this.lemmaTagName) {
                    return this.lemmaParser.parse(rdg);
                }

                return this.rdgParser.parse(rdg);
            });
    }
}
