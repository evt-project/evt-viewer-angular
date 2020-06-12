import { Injectable } from '@angular/core';

import { parse } from '.';
import { Surface, XMLElement, Zone } from '../../models/evt-models';
import { SurfaceParser, ZoneParser } from './facsimile-parser';
import { createParser } from './parser-models';

@Injectable({
    providedIn: 'root',
})
export class FacsimileParserService {
    private zoneParser = createParser(ZoneParser, parse);
    private surfaceParser = createParser(SurfaceParser, parse);

    parseSurfaces(xml: XMLElement): Surface[] {
        if (!xml) { return []; }

        return Array.from(xml.querySelectorAll<XMLElement>('surface')).map(s => this.surfaceParser.parse(s));
    }

    parseZones(xml: XMLElement): Zone[] {
        if (!xml) { return []; }

        return Array.from(xml.querySelectorAll<XMLElement>('zone')).map(z => this.zoneParser.parse(z));
    }

}
