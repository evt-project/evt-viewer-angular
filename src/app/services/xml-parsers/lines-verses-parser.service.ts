import { Injectable } from '@angular/core';
import { XMLID_ATTRIBUTE } from 'src/app/models/constants';
import { XMLElement } from 'src/app/models/evt-models';
import { parse } from '.';
import { LBParser, VerseParser } from './basic-parsers';
import { createParser, getNOrDefaultFromElement } from './parser-models';

@Injectable({
    providedIn: 'root',
})
export class LinesVersesParserService {
    public parseLines(document: XMLElement) {
        // Significant verses are those with at least @n or @xml:id attribute
        return Array.from(document.querySelectorAll<XMLElement>('lb'))
            .filter((el) => getNOrDefaultFromElement(el) || el.getAttribute(XMLID_ATTRIBUTE))
            .map((l) => this.parseLine(l));
    }

    public parseLine(line: XMLElement) {
        return createParser(LBParser, parse).parse(line);
    }

    public parseVerses(document: XMLElement) {
        return Array.from(document.querySelectorAll<XMLElement>('l'))
            .map((v) => this.parseLine(v));
    }

    public parseVerse(verse: XMLElement) {
        return createParser(VerseParser, parse).parse(verse);
    }
}
