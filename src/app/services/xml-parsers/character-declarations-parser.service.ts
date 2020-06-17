import { Injectable } from '@angular/core';
import { parse } from '.';
import { Char, XMLElement } from '../../models/evt-models';
import { CharParser, GlyphParser } from './character-declarations-parser';
import { createParser } from './parser-models';

@Injectable({
  providedIn: 'root',
})
export class CharacterDeclarationsParserService {

  private charParser = createParser(CharParser, parse);
  private glyphParser = createParser(GlyphParser, parse);

  parseChars(xml: XMLElement): Char[] {
    if (!xml) { return []; }

    return Array.from(xml.querySelectorAll<XMLElement>('char')).map(c => this.charParser.parse(c));
  }

  parseGlyphs(xml: XMLElement): Char[] {
    if (!xml) { return []; }

    return Array.from(xml.querySelectorAll<XMLElement>('glyph')).map(g => this.glyphParser.parse(g));
  }
}
