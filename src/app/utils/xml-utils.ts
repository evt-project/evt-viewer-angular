import { XMLElement } from '../models/evt-models';

// TODO get rid of any
// tslint:disable-next-line: no-any
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
