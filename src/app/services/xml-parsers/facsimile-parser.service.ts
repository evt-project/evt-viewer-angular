import { Injectable } from '@angular/core';

import { parse } from '.';
import {Facsimile, Graphic, Surface, SurfaceGrp, XMLElement, } from '../../models/evt-models';
import {FacsimileParser, GraphicParser, SurfaceGrpParser, SurfaceParser, } from './facsimile-parser';
import { createParser } from './parser-models';

@Injectable({
    providedIn: 'root',
})
export class FacsimileParserService {
    private facSimileParser = createParser(FacsimileParser, parse);

    private graphicsParser = createParser(GraphicParser, parse);// private zoneParser = createParser(ZoneParser, parse);
    private surfaceParser = createParser(SurfaceParser, parse);
    private surfaceGrpParser = createParser(SurfaceGrpParser, parse);

    parseSurfaces(xml: XMLElement): Surface[] {
        if (!xml) { return []; }

        return Array.from(xml.querySelectorAll<XMLElement>('surface')).map((s) => this.surfaceParser.parse(s));
    }

    parseGraphics(xml: XMLElement): Graphic[] {
        if (!xml) { return []; }

        return Array.from(xml.querySelectorAll<XMLElement>('graphic')).map((s) => this.graphicsParser.parse(s));
    }

    parseSurfaceGrp(xml: XMLElement): SurfaceGrp[] {
        if (!xml) { return []; }

        return Array.from(xml.querySelectorAll<XMLElement>('surfaceGrp')).map((s) => this.surfaceGrpParser.parse(s));
    }
    parseFacsimile(xml: XMLElement): Facsimile[] {

        if (!xml) { return []; }

        return Array.from(xml.querySelectorAll<XMLElement>('facsimile')).map((s) => this.facSimileParser.parse(s));
    }



}
