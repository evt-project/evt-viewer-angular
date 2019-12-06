import { XMLElement } from '../models/evt-models';

declare var window: any;

export function parseXml(xmlStr: string): XMLElement {
  if (typeof window.DOMParser !== 'undefined') {
    return (new window.DOMParser()).parseFromString(xmlStr, 'text/xml');
  } else if (typeof window.ActiveXObject !== 'undefined' &&
    new window.ActiveXObject('Microsoft.XMLDOM')) {
    const xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
    xmlDoc.async = 'false';
    xmlDoc.loadXML(xmlStr);
    return xmlDoc;
  } else {
    throw new Error('No XML parser found');
  }
}
