import { Injectable } from '@angular/core';

declare var window: any;

export function parseXml(xmlStr: string): HTMLElement {
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
