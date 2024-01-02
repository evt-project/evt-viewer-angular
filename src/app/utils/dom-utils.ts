import { XMLElement } from '../models/evt-models';

/**
 * Counter that takes into account the number of parsed elements with [xpath]{@link DOMUtilsService.html#xpath},
 * in order to allow the generation of unique ids when node path is not available.
 */
let totIdsGenerated = 0;

/**
 * Function to check if an element is nested into another particular element.
 * @param element The element to be checked
 * @param parentTagName TagName of the element that does not be a parent of the given element
 * @param attributes attributes
 *
 * @returns Whether the given element is nested in a node with given TagName or not
 */
export function isNestedInElem(element, parentTagName: string, attributes?: Array<{ key: string, value }>): boolean {
  return !!element && isNodeNestedInElem(element, parentTagName, false, attributes);
}
/**
 * Function to check if an element is directly nested into another particular element.
 * @param element The element to be checked
 * @param parentTagName TagName of the element that does not be a parent of the given element
 * @param attributes attributes
 *
 * @returns Whether the given element is nested in a node with given TagName or not
 */
export function isDirectlyNestedInElem(element, parentTagName: string, attributes?: Array<{ key: string, value }>): boolean {
  return isNodeNestedInElem(element, parentTagName, true, attributes);
}

/**
 * Function to check if an element is nested into another particular element.
 * @param element The element to be checked
 * @param parentTagName TagName of the element that does not be a parent of the given element
 * @param directCheck Whether to check only parentNode or analyize all ancestors
 * @param attributes attributes
 *
 * @returns Whether the given element is nested in a node with given TagName or not
 */
export function isNodeNestedInElem(
  element,
  parentTagName: string,
  directCheck: boolean,
  attributes?: Array<{ key: string, value }>,
): boolean {
  if (element.parentNode !== null) {
    if (element.parentNode.tagName === 'text') {
      return false;
    }
    if (parentTagName === '' || element.parentNode.tagName === parentTagName || element.parentNode.nodeName === parentTagName) {
      if (!attributes || attributes.length === 0) {
        return true;
      }
      if (!element.parentNode.attributes || element.parentNode.attributes.length === 0) {
        return false;
      }
      let matchingAttr = 0;
      attributes.forEach((attr) => {
        if (element.parentNode.attributes[attr.key] &&
          element.parentNode.attributes[attr.key].value === attr.value) {
          matchingAttr++;
        }
      });
      if (matchingAttr === attributes.length) {
        return true;
      }

      return directCheck ? false : isNestedInElem(element.parentNode, parentTagName, attributes);
    }

    return directCheck ? false : isNestedInElem(element.parentNode, parentTagName, attributes);
  }

  return false;
}
/**
 * This method will generate a string representing the xpath of the given element.
 * This string can be use as a unique identifier, since every element as a different xpath.
 * @param el XML element to analyze
 *
 * @returns calculated xpath of the given element
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function xpath(el: any): string {
  try {
    if (typeof el === 'string') {
      // document.evaluate(xpathExpression, contextNode, namespaceResolver, resultType, result );
      return document.evaluate(el, document, undefined, 0, undefined).stringValue;
    }
    if (!el || el.nodeType !== 1) { return ''; }
    let sames = [];
    if (el.parentNode) {
      sames = [].filter.call(el.parentNode.children, (x) => x.tagName === el.tagName);
    }
    let countIndex = sames.length > 1 ? ([].indexOf.call(sames, el) + 1) : 1;
    countIndex = `[${countIndex}]`;
    const tagName = el.tagName !== 'tei' ? '-' + el.tagName : '';

    return `${xpath(el.parentNode)}${tagName}${countIndex}`;
  } catch (e) {
    totIdsGenerated++; // TODO: remove side effects

    return `-id${totIdsGenerated}`;
  }
}

/**
 * This method will an excerpted or truncated XHTML string and returns a well-balanced XHTML string
 * - It checks for broken tags, e.g. <code>&lt;stro</code> [a <code>&lt;</code> after the last <code>&gt;</code> indicates a broken tag]
 *  - It eventually truncates broken tags
 * - It checks for broken elements, e.g. <code>&lt;strong&gt;Hello, w</code>
 *  - It gets an array of all tags (start, end, and self-closing)
 *  - It prepares an empty array where to store broken tags (<code>stack</code>)
 *  - It loops over all tags
 *    - when it founds an end tag, it pops it off of the stack
 *    - when it founds a start tag, it push it onto the stack
 *    - then it founds a self-closing tag, it do nothing
 *  - At the end of the loop, <code>stack</code> should contain only the start tags of the broken elements, most deeply-nested at the top
 *  - It loops over stack array
 *    - pops the unmatched tag off the stack
 *    - gets just the tag name
 *    - and appends the end tag
 *
 * @param XHTMLstring string to balanced
 *
 * @returns well-balanced XHTML string
 */
export function balanceXHTML(XHTMLstring: string): string {
  // Check for broken tags, e.g. <stro
  // Check for a < after the last >, indicating a broken tag
  if (XHTMLstring) {
    if (XHTMLstring.lastIndexOf('<') > XHTMLstring.lastIndexOf('>')) {
      // Truncate broken tag
      XHTMLstring = XHTMLstring.substring(0, XHTMLstring.lastIndexOf('<'));
    }

    // Check for broken elements, e.g. <strong>Hello, w
    // Get an array of all tags (start, end, and self-closing)
    const tags = XHTMLstring.match(/<(?!\!)[^>]+>/g);
    const stack = [];
    const tagToOpen = [];
    for (const tag in tags) {
      if (tag.search('/') === 1) { // </tagName>
        // end tag -- pop off of the stack
        // If the last element of the stack is the corresponding of opening tag
        const tagName = tag.replace(/[<\/>]/ig, '');
        const openTag = stack[stack.length - 1];
        if (openTag && (openTag.search('<' + tagName + ' ') >= 0 || openTag.search('<' + tagName + '>') >= 0)) {
          stack.pop();
        } else { // Tag non aperto
          tagToOpen.push(tagName);
        }
      } else if (tag.search('/>') <= 0) { // <tagName>
        // start tag -- push onto the stack
        stack.push(tag);
      } else { // <tagName />
        // self-closing tag -- do nothing
      }
    }

    // stack should now contain only the start tags of the broken elements, most deeply-nested at the top
    while (stack.length > 0) {
      // pop the unmatched tag off the stack
      let endTag = stack.pop();
      // get just the tag name
      endTag = endTag.substring(1, endTag.search(/[ >]/));
      // append the end tag
      XHTMLstring += '</' + endTag + '>';
    }

    while (tagToOpen.length > 0) {
      const startTag = tagToOpen.shift();
      XHTMLstring = '<' + startTag + '>' + XHTMLstring;
    }
  }

  // Return the well-balanced XHTML string
  return (XHTMLstring ? XHTMLstring : '');
}

/**
 * Get all DOM elements contained between the node elements
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getElementsBetweenTreeNode(start: any, end: any): XMLElement[] {
  const range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, end.length || end.childNodes.length);
  const commonAncestorChild = Array.from((range.commonAncestorContainer as XMLElement).children);
  const startIdx = commonAncestorChild.indexOf(start);
  const endIdx = commonAncestorChild.indexOf(end);
  const rangeNodes = commonAncestorChild.slice(startIdx, endIdx).filter((c) => c !== start);
  rangeNodes.forEach((c: XMLElement) => c.setAttribute('xpath', xpath(c).replace(/-/g, '/')));
  const fragment = range.cloneContents();
  const nodes = Array.from(fragment.childNodes);

  return nodes as XMLElement[];
}

export function getOuterHTML(element): string {
  let outerHTML: string = element.outerHTML;
  outerHTML = outerHTML ? outerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '') : outerHTML;

  return outerHTML;
}

export function getCommonAncestor(node1, node2) {
  const method = 'contains' in node1 ? 'contains' : 'compareDocumentPosition';
  const test = method === 'contains' ? 1 : 0x10;

  node1 = node1.parentNode;
  while (node1) {
    // tslint:disable-next-line:no-bitwise
    if ((node1[method](node2) & test) === test) {
      return node1;
    }
    node1 = node1.parentNode;
  }

  return undefined;
}

export function createNsResolver(doc: Document) {
  return (prefix: string) => prefix === 'ns' ? doc.documentElement.namespaceURI : undefined;
}

export function updateCSS(rules: Array<[string, string]>) {
  const thisCSS = document.styleSheets[0];
  rules.forEach((rule) => {
    thisCSS.insertRule(`${rule[0]} {${rule[1]}}`, 0);
  });
}

/**
 * This function searches inside every property of an object for the provided attribute it
 * it has one of the provided list of values. It falls back after a customizable number of iterations.
 * The limit counter could be inserted in a config, same as the ignoredProperties
 */
export function deepSearch(obj, attrToMatch: string, valuesToMatch, counter: number = 4000, ignoredProperties = []) {
  let results = [];
  for (const key in obj) {
    if (!ignoredProperties.includes(key)) {
      const value = obj[key];
      if ((key === attrToMatch) && (valuesToMatch.includes(obj[attrToMatch]))) {
        results.push(obj);
      }
      if (typeof value === 'object' && value !== null && !(value instanceof DOMTokenList)) {
        if (counter > 0) {
          results = results.concat(deepSearch(value, attrToMatch, valuesToMatch, counter, ignoredProperties));
          counter = counter - 1;
        } else {
          console.log('EVT WARN: element is too deep, not searching further in', obj, value);
          counter = 4000;
        }
      }
    }
  }

  return results;
}
