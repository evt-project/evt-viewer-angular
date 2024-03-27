import { xmlParser } from '.';
import {
    Facsimile,
    Graphic,
    Point,
    Surface,
    SurfaceGrp,
    XMLElement,
    Zone,
    ZoneHotSpot,
    ZoneLine,
    ZoneRendition,
} from '../../models/evt-models';
import { AttributeParser, EmptyParser } from './basic-parsers';
import { createParser, getID, parseChildren, Parser } from './parser-models';


@xmlParser('facsimile', FacsimileParser)
export class FacsimileParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    graphicParser = createParser(GraphicParser, this.genericParse);
    surfaceGrpParser = createParser(SurfaceGrpParser, this.genericParse);
    surfaceParser = createParser(SurfaceParser,this.genericParse);
    public parse(xml: XMLElement): Facsimile {

        // const zones = Array.from(xml.querySelectorAll<XMLElement>('zone')).map((z) => this.zoneParser.parse(z));
        //const attributes = this.attributeParser.parse(xml);
        //console.log('attributes', attributes);
        if (xml.getAttribute('rend') === 'double') {
            return {
                type: Facsimile,
                //id: getID(xml),
                corresp: xml.getAttribute('corresp')?.replace('#', ''),
                graphics: Array.from(xml.querySelectorAll<XMLElement>('graphic')).map((g) => this.graphicParser.parse(g)),
                surfaceGrps: undefined, // Array.from(xml.querySelectorAll<XMLElement>('surfaceGrp')).map((g) => this.surfaceGrpParser.parse(g)),
                surfaces: undefined,//Array.from(xml.querySelectorAll<XMLElement>('surface')).map((g) => this.surfaceParser.parse(g)),
                attributes: this.attributeParser.parse(xml),
                content: parseChildren(xml, this.genericParse),
            };
        }

        return {
            type: Facsimile,
            //id: getID(xml),
            corresp: xml.getAttribute('corresp')?.replace('#', ''),
            graphics: Array.from(xml.querySelectorAll<XMLElement>('graphic')).map((g) => this.graphicParser.parse(g)),
            surfaceGrps: Array.from(xml.querySelectorAll<XMLElement>('surfaceGrp')).map((g) => this.surfaceGrpParser.parse(g)),
            surfaces: Array.from(xml.querySelectorAll<XMLElement>('surface')).map((g) => this.surfaceParser.parse(g)),
            attributes: this.attributeParser.parse(xml),
            content: parseChildren(xml, this.genericParse),
        };

    }
}
@xmlParser('zone', ZoneParser)
export class ZoneParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    public parse(xml: XMLElement): Zone {
        let coords: Point[];
        const attributes = this.attributeParser.parse(xml);

        if (xml.getAttribute('points')) {
            coords = attributes.points.trim().split(' ')
                .filter((sp)=> sp.length > 0)
                .map((stringPoint) => {
                    const points = stringPoint.split(',');
                    const px = parseInt(points[0], 10);
                    const py = parseInt(points[1], 10)
                    if (!isNaN(px) && !isNaN(py)){
                        return {
                            x: px,
                            y: py,
                        };
                    }
                });
        } else {
            const ul: Point = {
                x: parseFloat(attributes.ulx) || undefined,
                y: parseFloat(attributes.uly) || undefined,
            };
            const lr: Point = {
                x: parseFloat(attributes.lrx) || undefined,
                y: parseFloat(attributes.lry) || undefined,
            };
            const ur: Point = {
                x: lr.x,
                y: ul.y,
            };
            const ll: Point = {
                x: ul.x,
                y: lr.y,
            };
            coords = [ul, ur, lr, ll];
        }
        const id = getID(xml);
        const surface = xml.closest<XMLElement>('surface');

        return {
            type: Zone,
            attributes,
            id,
            coords,
            corresp: attributes.corresp?.replace('#', '') ?? id,
            rend: attributes.rend,
            rendition: attributes.rendition as ZoneRendition,
            rotate: attributes.rotate ? parseInt(attributes.rotate, 10) || 0 : 0,
            content: parseChildren(xml, this.genericParse),
            surface: surface ? getID(surface) : '',
        };
    }
}

@xmlParser('graphic', GraphicParser)
export class GraphicParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    public parse(xml: XMLElement): Graphic {
        return {
            type: Graphic,
            url: xml.getAttribute('url') || '',
            height: xml.getAttribute('height') || '',
            width: xml.getAttribute('width') || '',
            attributes: this.attributeParser.parse(xml),
            content: parseChildren(xml, this.genericParse),
        };
    }
}

@xmlParser('surface', SurfaceParser)
export class SurfaceParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    graphicParser = createParser(GraphicParser, this.genericParse);
    zoneParser = createParser(ZoneParser, this.genericParse);
    public parse(xml: XMLElement): Surface {
        const zones = Array.from(xml.querySelectorAll<XMLElement>('zone')).map((z) => this.zoneParser.parse(z));

        return {
            type: Surface,
            id: getID(xml),
            corresp: xml.getAttribute('corresp')?.replace('#', ''),
            graphics: Array.from(xml.querySelectorAll<XMLElement>('graphic')).map((g) => this.graphicParser.parse(g)),
            zones: {
                lines: zones.filter((z) => z.rendition === 'Line') as ZoneLine[],
                hotspots: zones.filter((z) => z.rendition === 'HotSpot') as ZoneHotSpot[],
            },
            attributes: this.attributeParser.parse(xml),
            content: parseChildren(xml, this.genericParse),
        };
    }
}

@xmlParser('surfaceGrp', SurfaceGrpParser)
export class SurfaceGrpParser extends EmptyParser implements Parser<XMLElement> {

    attributeParser = createParser(AttributeParser, this.genericParse);

    surfaceParser = createParser(SurfaceParser, this.genericParse);
    public parse(xml: XMLElement): SurfaceGrp {
        console.log('surgface grp');

        const surfaces = Array.from(xml.querySelectorAll<XMLElement>('surface')).map((s) => this.surfaceParser.parse(s));

        return {
            type: SurfaceGrp,
            surfaces: surfaces,
            attributes: this.attributeParser.parse(xml),
            content: parseChildren(xml, this.genericParse),
        };
    }
}
