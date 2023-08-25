import { XMLElement } from '../models/evt-models';

// TODO get rid of any
// eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any
declare var window: any;

export function parseXml(xmlStr: string): XMLElement {
  if (typeof window.DOMParser !== 'undefined') {

    return (new window.DOMParser()).parseFromString(xmlStr, 'text/xml');
  }

  if (typeof window.ActiveXObject !== 'undefined' &&
    new window.ActiveXObject('Microsoft.XMLDOM')) {
    const xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
    xmlDoc.async = 'false';
    xmlDoc.loadXML(xmlStr);

    return xmlDoc;
  }
  throw new Error('No XML parser found');
}

export function replaceMultispaces(textContent: string) {
  return textContent.replace(/\s{2,}/g, ' ');
}

export function replaceNewLines(textContent: string) {
  return replaceMultispaces(textContent.trim().replace(/\n/g, ' '));
}

export function replaceNotWordChar(textContent: string) {
  return textContent && textContent.replace(/[\W_]/, ' ') ;
}

export function removeSpaces(textContent: string) {
  return textContent.replace(/\s/g, '');
}

/**
* Significant text sometimes is split inside two or more text evt-element inside the main one, especially when it contains new line characters.
* This function returns a string with all the text element chained
* @param n XMLElement
* @returns string
*/
export function chainFirstChildTexts(elem: XMLElement): string {
  const evtTextElements = ['#text'];
  const evtTextComplexElements = ['choice', 'app', 'l', 'quote'];
  const textProperty = 'nodeValue';
  let out = '';
  elem.childNodes.forEach((x) => (evtTextElements.includes(x.nodeName)) ? out += x[textProperty] : (
    evtTextComplexElements.includes(x.nodeName) ? out += chainDeepTexts(x) : '' ))

  return out;
}

export function chainDeepTexts(elem: ChildNode): string {
  const evtInnerTextElements = ['#text', 'reg', 'corr', 'rdg'];
  const textProperty = 'textContent';
  let out = '';
  elem.childNodes.forEach((x) => (evtInnerTextElements.includes(x.nodeName)) ? ((x[textProperty] !== null) ? out += x[textProperty] : '') : '')

  return out;
}

/**
* Retrieve external bibliography element outside the analogue element
* This first solution is brutal: it searches all document for a bibl with the correct xml:id
* it would be faster if we knew the id or unique element to search in
* @param analogue XMLElement
* @returns array of Bibliography Element
*/
export function getExternalSources(elem: XMLElement, attrSourceNames: string[], attrTargetName: string): XMLElement[] {
  const sourceIDs = attrSourceNames.map((x) => elem.getAttribute(x));
  const sourcesToFind = sourceIDs.filter((x) => x).map((x) => x.replace('#',''));

  return Array.from(elem.ownerDocument.querySelectorAll<XMLElement>('bibl, cit'))
    .filter((x) => sourcesToFind.includes(x.getAttribute(attrTargetName)))
}
