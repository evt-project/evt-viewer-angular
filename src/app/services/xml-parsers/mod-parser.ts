import { parse, xmlParser } from '.';
import { AttributeParser, EmptyParser, GenericElemParser } from './basic-parsers';
import { createParser, getID, parseChildren, Parser } from './parser-models';
import { Mod, XMLElement } from 'src/app/models/evt-models';

@xmlParser('mod', ModParser)
@xmlParser('evt-mod-parser', ModParser)
export class ModParser extends EmptyParser implements Parser<XMLElement> {

    elementParser = createParser(GenericElemParser, parse);
    attributeParser = createParser(AttributeParser, this.genericParse);

    public parse(modEl: XMLElement): Mod {

        const varSeq = modEl.getAttribute('varSeq');
        const parentVarSeq = modEl.parentElement.getAttribute('varSeq');
        const defVarSeq = (varSeq !== null) ? varSeq : parentVarSeq;

        return <Mod> {
            id: getID(modEl),
            type: Mod,
            attributes: this.attributeParser.parse(modEl),
            changeLayer: modEl.getAttribute('change'),
            varSeq: defVarSeq,
            isRdg: (modEl.parentElement.tagName === 'rdg'),
            insideApp: ((modEl.parentElement.tagName === 'rdg') || (modEl.parentElement.tagName === 'lem')),
            content: parseChildren(modEl, this.genericParse),
            note: Array.from(modEl.querySelectorAll<XMLElement>('note')).map((x) => x.textContent),
            originalEncoding: modEl,
        };
    }

}
