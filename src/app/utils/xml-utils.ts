import { XMLElement } from '../models/evt-models';

// TODO get rid of any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

export const parseXml = (xmlStr: string) => {
  if (typeof window.DOMParser !== 'undefined') {

    return (new window.DOMParser()).parseFromString(xmlStr, 'text/xml') as XMLElement;
  }

  if (typeof window.ActiveXObject !== 'undefined' &&
    new window.ActiveXObject('Microsoft.XMLDOM')) {
    const xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
    xmlDoc.async = 'false';
    xmlDoc.loadXML(xmlStr);

    return xmlDoc as XMLElement;
  }
  throw new Error('No XML parser found');
};

export const replaceMultispaces = (textContent: string) => textContent.replace(/\s{2,}/g, ' ');
export const replaceNewLines = (textContent: string) => replaceMultispaces(textContent.trim().replace(/\n/g, ' '));
export const replaceNotWordChar = (textContent: string) => textContent && textContent.replace(/[\W_]/, ' ');
export const removeSpaces = (textContent: string) => textContent.replace(/\s/g, '');

