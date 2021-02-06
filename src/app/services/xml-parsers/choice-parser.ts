import { xmlParser } from '.';
import { Choice, ChoiceType, XMLElement } from '../../models/evt-models';
import { AttributeParser, EmptyParser } from './basic-parsers';
import { createParser, parseChildren, Parser } from './parser-models';

@xmlParser('choice', ChoiceParser)
export class ChoiceParser extends EmptyParser implements Parser<XMLElement> {
    attributeParser = createParser(AttributeParser, this.genericParse);
    parse(xml: XMLElement): Choice {
        const attributes = this.attributeParser.parse(xml);
        const choiceComponent: Choice = {
            type: Choice,
            content: parseChildren(xml, this.genericParse),
            attributes,
            editorialInterventionType: this.getEditorialInterventionType(xml),
            originalContent: this.getOriginalContent(xml),
            normalizedContent: this.getNormalizedContent(xml),
        };

        return choiceComponent;
    }

    private getEditorialInterventionType(xml: XMLElement): ChoiceType | '' {
        const sicCorEls = Array.from(xml.querySelectorAll<XMLElement>('sic, corr'))
            .filter(el => el.parentElement === xml);
        if (sicCorEls.length > 0) {
            return 'emendation';
        }
        const origRegEls = Array.from(xml.querySelectorAll<XMLElement>('orig, reg, abbr, expan'))
            .filter(el => el.parentElement === xml);
        if (origRegEls.length > 0) {
            return 'normalization';
        }

        return '';
    }

    private getOriginalContent(xml: XMLElement) {
        return Array.from(xml.querySelectorAll<XMLElement>('orig, sic, abbr'))
            .filter(el => el.parentElement === xml)
            .map(el => this.genericParse(el));
    }

    private getNormalizedContent(xml: XMLElement) {
        return Array.from(xml.querySelectorAll<XMLElement>('reg, corr, expan'))
            .filter(el => el.parentElement === xml)
            .map(el => this.genericParse(el));
    }
}
