import { xmlParser } from '.';
import { Graphic, Point, Surface, XMLElement, Zone, ZoneHotSpot, ZoneLine, ZoneRendition } from '../../models/evt-models';
import { AttributeParser, EmptyParser } from './basic-parsers';
import { createParser, getID, parseChildren, Parser } from './parser-models';

@xmlParser('zone', ZoneParser)
export class ZoneParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    public parse(xml: XMLElement): Zone {
        let coords: Point[];
        const attributes = this.attributeParser.parse(xml);
        if (xml.getAttribute('points')) {
            coords = attributes.points.split(' ')
                .map(stringPoint => {
                    const points = stringPoint.split(',');

                    return {
                        x: parseInt(points[0], 10),
                        y: parseInt(points[1], 10),
                    };
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
        const zones = Array.from(xml.querySelectorAll<XMLElement>('zone')).map(z => this.zoneParser.parse(z));

        return {
            type: Surface,
            id: getID(xml),
            corresp: xml.getAttribute('corresp')?.replace('#', ''),
            graphics: Array.from(xml.querySelectorAll<XMLElement>('graphic')).map(g => this.graphicParser.parse(g)),
            zones: {
                lines: zones.filter(z => z.rendition === 'Line') as ZoneLine[],
                hotspots: zones.filter(z => z.rendition === 'HotSpot') as ZoneHotSpot[],
            },
            attributes: this.attributeParser.parse(xml),
            content: parseChildren(xml, this.genericParse),
        };
    }
}
