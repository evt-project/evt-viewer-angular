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
 * It removes excessive spaces, any tabulation, new lines and non-word characters
 */
export function normalizeSpaces(textContent: string) {
  return textContent.replace(/[\s]{2,}|\n|\t|\r/g, ' ').trimStart().trimEnd();
}

/**
* Significant text sometimes is split inside two or more text evt-element inside the main one, especially when it contains new line characters.
* This function returns a string with all the text elements chained
*/
export function chainFirstChildTexts(elem: XMLElement, evtTextComplexElements: string[], evtInnerTextElements: string[]): string {
  if (elem === undefined) { return ''; };
  const evtTextElements = {
    '#text': 'nodeValue',
    'p': 'textContent',
  };
  let out = '';
  elem.childNodes.forEach((node) => (evtTextElements[node.nodeName] !== undefined) ? out += node[ evtTextElements[node.nodeName] ] : (
    evtTextComplexElements.includes(node.nodeName) ? out += chainDeepTexts(node, evtInnerTextElements) : '' ))

  return out;
}

/**
 * Retrieve and chain textContent of all descendents
 * @param elem ChildNode
 * @returns out string
 */
export function chainDeepTexts(elem: ChildNode, evtInnerTextElements: string[]): string {
  const textProperty = 'textContent';
  let out = '';
  elem.childNodes.forEach((x) => (evtInnerTextElements.includes(x.nodeName)) ? ((x[textProperty] !== null) ? out += x[textProperty] : '') : '')

  return out;
}

/**
* Retrieve external elements searching between provided elements types and filtering on attributes base
* It searches all document for a bibl with the correct xml:id.
* It would be faster if we knew the id or unique element to search in
*/
export function getExternalElements(elem: XMLElement, attrSourceNames: string[], attrTargetName: string, elTypes: string): XMLElement[] {
  const sourceIDs = attrSourceNames.map((x) => elem.getAttribute(x));
  const sourcesToFind = sourceIDs.filter((x) => x).map((x) => x.replace('#',''));

  if (sourcesToFind.length === 0) {
    return [];
  }

  return Array.from(elem.ownerDocument.querySelectorAll<XMLElement>(elTypes))
    .filter((x) => sourcesToFind.includes(x.getAttribute(attrTargetName)))
}

/**
 * If an element's attribute 'type' has one of the provided values then it is considered an analogue
 */
export function isAnalogue(elem: XMLElement, markerAttrs: string[]): boolean {
  return (markerAttrs.includes(elem.getAttribute('type')));
}

/**
 * If an element has one of the provided attributes then it is considered a source
 */
export function isSource(elem: XMLElement, attrs: string[]): boolean {
  let validAttrs = false;
  attrs.forEach((attr) => { if (elem.getAttribute(attr) !== null) { validAttrs = true } });

  return (validAttrs);
}


/**
 * Retrieve textContent and elements between the provided element and the one found with the xml:id provided
 */
export function getContentBetweenElementAndId(fromElement: XMLElement, toXMLID: string): { text: string, elements: any } {

  if ((fromElement === null) || (fromElement === undefined) || (toXMLID === null)) {
    return { text: '', elements: [] };
  }

  const cleanID = toXMLID.replace('#','');
  let found = false;
  // text after the milestone but still inside the parent element
  let foundText = (fromElement.nextSibling !== null) ? fromElement.nextSibling.textContent : '';
  // the milestone is always inside another element?
  // otherwise const foundElements = [fromElement.nextSibling];
  let next = (fromElement.nextElementSibling !== null) ?
    fromElement.nextElementSibling as XMLElement :
    fromElement.parentElement.nextElementSibling as XMLElement;

  // creating a fake element for partial text included from milestone on
  let foundElements = [];
  if (fromElement.parentElement.nextElementSibling !== null) {
    const nextEdited = fromElement.parentElement.nextElementSibling.cloneNode(true);
    nextEdited.textContent = foundText;
    foundElements.push(nextEdited);
  }

  let maxExec = 50;

  while(!found && next !== null && maxExec !== 0) {
    foundElements.push(next);
    foundText = foundText + next.textContent;
    if (next.getAttribute('xml:id') === cleanID) {
      found = true;
    } else {
      maxExec--;
      if (next.nextElementSibling === null) {
        if (next.parentElement !== null) {
          next = next.parentElement.nextElementSibling as XMLElement;
          maxExec--;
        } else {
          next = null;
        }
      } else {
        next = next.nextElementSibling as XMLElement;
      }
    }
  }

  return { 'text': foundText, 'elements': foundElements };
}
