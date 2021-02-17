import { AppConfig } from 'src/app/app.config';
import { ParserRegister, xmlParser } from '.';
import {
    GenericElement, NamedEntitiesList, NamedEntity, NamedEntityInfo, NamedEntityLabel,
    NamedEntityRef, NamedEntityType, Relation, XMLElement,
} from '../../models/evt-models';
import { xpath } from '../../utils/dom-utils';
import { replaceNewLines } from '../../utils/xml-utils';
import { AttributeMapParser, AttributeParser, EmptyParser, GenericElemParser, TextParser } from './basic-parsers';
import { createParser, parseChildren, Parser } from './parser-models';

export const namedEntitiesListsTagNamesMap: { [key: string]: string } = {
    persons: 'listPerson',
    places: 'listPlace',
    organizations: 'listOrg',
    events: 'listEvent',
    occurrences: 'persName[ref], placeName[ref], orgName[ref], geogName[ref], event[ref]',
};

export function getListType(tagName): NamedEntityType {
    return tagName.replace('list', '').toLowerCase();
}

export function getListsToParseTagNames() {
    const neListsConfig = AppConfig.evtSettings.edition.namedEntitiesLists || {};

    return Object.keys(neListsConfig)
        .map((i) => neListsConfig[i].enabled ? namedEntitiesListsTagNamesMap[i] : undefined)
        .filter(ne => !!ne);
}

@xmlParser('evt-named-entities-list-parser', NamedEntitiesListParser)
export class NamedEntitiesListParser extends EmptyParser implements Parser<XMLElement> {
    private neListsConfig = AppConfig.evtSettings.edition.namedEntitiesLists || {};
    attributeParser = createParser(AttributeParser, this.genericParse);
    parse(xml: XMLElement): NamedEntitiesList {
        const parsedList: NamedEntitiesList = {
            type: NamedEntitiesList,
            id: xml.getAttribute('xml:id') || xpath(xml),
            label: '',
            namedEntityType: getListType(xml.tagName),
            content: [],
            sublists: [],
            originalEncoding: xml,
            relations: [],
            description: [],
            attributes: this.attributeParser.parse(xml),
        };

        const relationParse = createParser(RelationParser, this.genericParse);
        xml.childNodes.forEach((child: XMLElement) => {
            if (child.nodeType === 1) {
                switch (child.tagName.toLowerCase()) {
                    case 'head':
                        parsedList.label = replaceNewLines(child.textContent);
                        break;
                    case 'desc':
                        parsedList.description.push(this.genericParse(child));
                        break;
                    case 'relation':
                        if (this.neListsConfig.relations.enabled) {
                            parsedList.relations.push(relationParse.parse(child));
                        }
                        break;
                    case 'listrelation':
                        if (this.neListsConfig.relations.enabled) {
                            child.querySelectorAll<XMLElement>('relation').forEach(r => parsedList.relations.push(relationParse.parse(r)));
                        }
                        break;
                    default:
                        if (getListsToParseTagNames().indexOf(child.tagName) >= 0) {
                            const subListParser = ParserRegister.get('evt-named-entities-list-parser');
                            const parsedSubList = subListParser.parse(child) as NamedEntitiesList;
                            parsedList.sublists.push(parsedSubList);
                            parsedList.content = parsedList.content.concat(parsedSubList.content);
                            parsedList.relations = parsedList.relations.concat(parsedSubList.relations);
                        } else {
                            parsedList.content.push(this.genericParse(child) as NamedEntity);
                        }
                }
            }
        });
        parsedList.label = parsedList.label || xml.getAttribute('type') || `List of ${parsedList.namedEntityType}`;

        return parsedList;
    }
}

@xmlParser('evt-named-entity-parser', NamedEntityRefParser)
export class NamedEntityRefParser extends EmptyParser implements Parser<XMLElement> {
    elementParser = createParser(GenericElemParser, this.genericParse);
    attributeParser = createParser(AttributeParser, this.genericParse);
    parse(xml: XMLElement): NamedEntityRef | GenericElement {
        const ref = xml.getAttribute('ref');
        if (!ref) { return this.elementParser.parse(xml); }

        const neTypeMap: { [key: string]: NamedEntityType } = {
            placename: 'place',
            geogname: 'place',
            persname: 'person',
            orgname: 'org',
            event: 'event',
        };

        return {
            type: NamedEntityRef,
            entityId: getEntityID(ref),
            entityType: neTypeMap[xml.tagName.toLowerCase()],
            path: xpath(xml),
            content: parseChildren(xml, this.genericParse),
            attributes: this.attributeParser.parse(xml),
            class: xml.tagName.toLowerCase(),
        };
    }

}

// Generic entity parser
export class EntityParser extends EmptyParser implements Parser<XMLElement> {
    // TODO: try to refactor subclasses to use a function parameter to get labels
    attributeParsers = createParser(AttributeMapParser, this.genericParse);
    parse(xml: XMLElement): NamedEntity {
        const elId = xml.getAttribute('xml:id') || xpath(xml);
        const label = replaceNewLines(xml.textContent) || 'No info';
        const entity: NamedEntity = {
            type: NamedEntity,
            id: elId,
            sortKey: xml.getAttribute('sortKey') || (label ? label[0] : '') || xml.getAttribute('xml:id') || xpath(xml),
            originalEncoding: xml,
            label,
            namedEntityType: this.getEntityType(xml.tagName),
            content: Array.from(xml.children).map((subchild: XMLElement) => this.parseEntityInfo(subchild)),
            attributes: this.attributeParsers.parse(xml),
        };

        return entity;
    }

    private parseEntityInfo(xml: XMLElement): NamedEntityInfo {
        return {
            type: NamedEntityInfo,
            label: xml.nodeType === 1 ? xml.tagName.toLowerCase() : 'info',
            content: [this.genericParse(xml)],
            attributes: xml.nodeType === 1 ? this.attributeParsers.parse(xml) : {},
        };
    }

    private getEntityType(tagName): NamedEntityType { return tagName.toLowerCase(); }
}

@xmlParser('person', PersonParser)
export class PersonParser extends EntityParser {
    parse(xml: XMLElement): NamedEntity {
        return {
            ...super.parse(xml),
            label: this.getLabel(xml),
        };
    }

    private getLabel(xml: XMLElement) { // TODO: refactor me, also try to use a function parameter for the label for each entity
        const nameElement = xml.querySelector<XMLElement>('name');
        const forenameElement = xml.querySelector<XMLElement>('forename');
        const surnameElement = xml.querySelector<XMLElement>('surname');
        const persNameElement = xml.querySelector<XMLElement>('persName');
        const occupationElement = xml.querySelector<XMLElement>('occupation');
        let label: NamedEntityLabel = 'No info';
        if (persNameElement) {
            label = replaceNewLines(persNameElement.textContent) || 'No info';
        } else if (forenameElement || surnameElement) {
            label += forenameElement ? `${replaceNewLines(forenameElement.textContent)} ` : '';
            label += surnameElement ? `${replaceNewLines(surnameElement.textContent)} ` : '';
        } else if (nameElement) {
            label = replaceNewLines(nameElement.textContent) || 'No info';
        } else {
            label = replaceNewLines(xml.textContent) || 'No info';
        }
        label += occupationElement ? ` (${replaceNewLines(occupationElement.textContent)})` : '';

        return label;
    }
}

@xmlParser('personGrp', PersonGroupParser)
export class PersonGroupParser extends EntityParser {
    parse(xml: XMLElement): NamedEntity { return { ...super.parse(xml), label: this.getLabel(xml) }; }

    private getLabel(xml: XMLElement) { // TODO: refactor me
        const role = xml.getAttribute('role');
        let label: NamedEntityLabel = 'No info';
        if (role) {
            label = role.trim();
        } else {
            label = replaceNewLines(xml.textContent) || 'No info';
        }

        return label;
    }
}

@xmlParser('place', PlaceParser)
export class PlaceParser extends EntityParser {
    parse(xml: XMLElement): NamedEntity { return { ...super.parse(xml), label: this.getLabel(xml) }; }

    private getLabel(xml: XMLElement) {
        const placeNameElement = xml.querySelector<XMLElement>('placeName');
        const settlementElement = xml.querySelector<XMLElement>('settlement');
        let label: NamedEntityLabel = 'No info';
        if (placeNameElement) {
            label = replaceNewLines(placeNameElement.textContent) || 'No info';
        } else if (settlementElement) {
            label = replaceNewLines(settlementElement.textContent) || 'No info';
        }

        return label;
    }
}

export class EventParser extends EntityParser {
    parse(xml: XMLElement): NamedEntity {
        return {
            ...super.parse(xml),
            label: textLabel('label', xml),
        };
    }

    getLabel(xml: XMLElement) {
        const eventLabelElement = xml.querySelector<XMLElement>('label');

        return (eventLabelElement ? replaceNewLines(eventLabelElement.textContent) : '') || 'No info';
    }
}

@xmlParser('org', OrganizationParser)
export class OrganizationParser extends EntityParser {
    parse(xml: XMLElement): NamedEntity {
        return {
            ...super.parse(xml),
            label: textLabel('orgName', xml),
        };
    }
}

export class EntityInfoParser extends EmptyParser implements Parser<XMLElement> {
    attributeParsers = createParser(AttributeParser, this.genericParse);
    parse(xml: XMLElement): NamedEntityInfo {
        return {
            type: NamedEntityInfo,
            label: xml.nodeType === 1 ? xml.tagName.toLowerCase() : 'info',
            content: [this.genericParse(xml)],
            attributes: xml.nodeType === 1 ? this.attributeParsers.parse(xml) : {},
        };
    }
}

export class RelationParser extends EmptyParser implements Parser<XMLElement> {
    attributeParsers = createParser(AttributeParser, this.genericParse);
    entityInfoParser = createParser(EntityInfoParser, this.genericParse);
    textParser = createParser(TextParser, this.genericParse);

    parse(xml: XMLElement): Relation {
        const descriptionEls = xml.querySelectorAll<XMLElement>('desc');
        const attributes = this.attributeParsers.parse(xml);
        const { name, type } = attributes;
        const active = xml.getAttribute('active') || ''; // TODO: make get attributes return '' as default?
        const mutual = xml.getAttribute('mutual') || '';
        const passive = xml.getAttribute('passive') || '';

        const relation: Relation = {
            type: Relation,
            name,
            activeParts: active.replace(/#/g, '').split(' '), // TODO refactor to a single function
            mutualParts: mutual.replace(/#/g, '').split(' '),
            passiveParts: passive.replace(/#/g, '').split(' '),
            relationType: type,
            attributes,
            content: Array.from(xml.children).map((subchild: XMLElement) => this.entityInfoParser.parse(subchild)),
            description: [],
        };
        if (descriptionEls && descriptionEls.length > 0) {
            descriptionEls.forEach((el) => relation.description.push(this.genericParse(el)));
        } else {
            relation.description = [this.textParser.parse(xml)];
        }
        const parentListEl = xml.parentElement.tagName === 'listRelation' ? xml.parentElement : undefined;
        if (parentListEl) {
            relation.relationType = `${(parentListEl.getAttribute('type') || '')} ${(relation.relationType || '')}`.trim();
        }

        return relation;
    }
}

function getEntityID(ref: string) { return ref ? ref.replace(/#/g, '') : ''; }
function textLabel(elemName: string, xml: XMLElement) {
    const el = xml.querySelector<XMLElement>(elemName);

    return (el ? replaceNewLines(el.textContent) : '') || 'No info';
}
