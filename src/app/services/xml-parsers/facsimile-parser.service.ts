import { Injectable } from '@angular/core';

import { parse } from '.';
import {Surface, SurfaceGrp, XMLElement, Zone} from '../../models/evt-models';
import {SurfaceGrpParser, SurfaceParser, ZoneParser} from './facsimile-parser';
import { createParser } from './parser-models';

@Injectable({
    providedIn: 'root',
})
export class FacsimileParserService {
    private zoneParser = createParser(ZoneParser, parse);
    private surfaceParser = createParser(SurfaceParser, parse);
    private surfaceGrpParser = createParser(SurfaceGrpParser, parse);

    parseSurfaces(xml: XMLElement): Surface[] {
        if (!xml) { return []; }

        return Array.from(xml.querySelectorAll<XMLElement>('surface')).map((s) => this.surfaceParser.parse(s));
    }

    parseSurfacesGrp(xml: XMLElement): SurfaceGrp[] {
        if (!xml) { return []; }

        return Array.from(xml.querySelectorAll<XMLElement>('surfaceGrp')).map((s) => this.surfaceGrpParser.parse(s));
    }

    parseZones(xml: XMLElement): Zone[] {
        if (!xml) { return []; }

        return Array.from(xml.querySelectorAll<XMLElement>('zone')).map((z) => this.zoneParser.parse(z));
    }

}
