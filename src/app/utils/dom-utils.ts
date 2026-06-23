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
  const commonAncestorChildren = Array.from((range.commonAncestorContainer as XMLElement).children);
  const startIdx = commonAncestorChildren.indexOf(start);
  const endIdx = commonAncestorChildren.indexOf(end);
  const rangeNodes = commonAncestorChildren.slice(startIdx, endIdx).filter((c) => c !== start);
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
 * It applies a multiplier to a given css size
 * @param value - CSS units such as '1rem', '5em', '5px', '6wh'.
 * @params multiplier - Multiplier such as 0.8, 2 ...
 * @returns The resulting units
 */
export function reduceCssUnit(value: string, multiplier: number): string {
  const match = value.match(/^(\d*\.?\d+)([a-zA-Z%]+)$/);
  if (!match) {
    throw new Error("Invalid css unit provided");
  }
  const [, number, unit] = match;
  const numberFloat = parseFloat(number);
  const numberReduced = numberFloat * multiplier;
  return `${numberReduced.toFixed(2)}${unit}`;
}

/**
 * This function searches inside every property of an object for the provided attribute
 * it has one of the provided list of values. It stops after a customizable number of iterations to avoid waste of resources.
 * The limit counter could be inserted in a config, same as the ignoredProperties
 * The types defined in loopAttributes are elements to be ignored because their methods of "dom navigation" generate loops
 */
export function deepSearch(obj, attrToMatch: string, valuesToMatch: string[], counter: number = 4000, ignoredProperties = []) {
  const loopAttributes = [DOMTokenList, NodeList, NamedNodeMap, HTMLCollection, HTMLElement]
  let results = [];
  for (const key in obj) {
    if (!ignoredProperties.includes(key)) {
      const value = obj[key];
      if ((key === attrToMatch) && (valuesToMatch.includes(obj[attrToMatch]))) {
        results.push(obj);
      }

      if (key === 'attributes') {
        for (const attrKey in value) {
          if (attrKey === attrToMatch && valuesToMatch.includes(value[attrKey])) {
            results.push(obj);
          }
        }
        continue;
      }

      let excludedForType = false;
      for (let i = 0; i < loopAttributes.length; i++) {
        if (value instanceof loopAttributes[i]) {
          excludedForType = true;
          break;
        }
      }

      if ((typeof value === 'object') && (value !== null) && (!excludedForType)) {
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

/**
 * Recursively filter items
 * 
 * @param content the array to filter
 * @param filterExpression the expression that items must satisfy to be included in the result
 * @returns the filtered array
 */
export function deepFilter(content: any[], filterExpression: (item: any) => boolean, parentId: string | null)
  : { content: any[], filteredItems: { parentId: string, item: any }[] } {

  const filteredItems: { parentId: string, item: any }[] = []

  content = content.filter((item: any) => {
    if (!filterExpression(item)) {
      filteredItems.push({ parentId, item })
      return false;
    }

    if (item.content) {
      const result = deepFilter(item.content, filterExpression, item.attributes['id']);

      item.content = result.content;
      filteredItems.push(...result.filteredItems);
    }

    return true;
  });

  return { content, filteredItems };
}

/**
 * Search recursively an object for properties with a given name,
 * inside children objects and children arrays of objects. Useful for debugging.
 * @param obj the object in which to search.
 * @param propertyName the name of the property to find.
 * @returns an array with the found objects or empty.
 */
export function deepSearchByKey(obj: object, propertyName: string): object[] {
  const results: object[] = [];

  function recurse(current: any) {
    if (Array.isArray(current)) {
      current.forEach(item => recurse(item));
    } else if (typeof current === 'object' && current !== null) {
      for (const key in current) {
        if (current.hasOwnProperty(key)) {
          if (key === propertyName) {
            results.push(current[key]);
          }
          recurse(current[key]);
        }
      }
    }
  }

  recurse(obj);
  return results;
}

export function getTopMostAncestor(element: HTMLElement): HTMLElement {
  let current = element;
  while (current.parentElement) {
    current = current.parentElement;
  }
  return current;
}

export function isElementBetween(fromEl: HTMLElement, element: HTMLElement, toEl: HTMLElement): boolean {
  if (!fromEl || !element || !toEl || !(fromEl instanceof Node) || !(element instanceof Node) || !(toEl instanceof Node)) {
    return false;
  }
  try {
    const isAfterFrom = fromEl.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING;
    const isBeforeTo = element.compareDocumentPosition(toEl) & Node.DOCUMENT_POSITION_FOLLOWING;
    const isBetween = isAfterFrom && isBeforeTo;
    return !!isBetween;
  }
  catch (error) {
    console.error(error);
    return false;
  }
}

/**
 * Get absolute xPath position from dom element
 * xPath position will does not contain any id, class or attribute, etc selector
 * Because, Some page use random id and class. This function should ignore that kind problem, so we're not using any selector
 * 
 * @param {Element} element element to get position
 * @returns {String} xPath string
 */
export function getXPath(el: any): string {
  try {
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
  // // Selector
  // let selector = '';
  // // Loop handler
  // let foundRoot;
  // // Element handler
  // let currentElement = element;

  // // Do action until we reach html element
  // do {
  //     // Get element tag name 
  //     const tagName = currentElement.tagName.toLowerCase();
  //     // Get parent element
  //     if(!currentElement.parentElement) {
  //       console.log('asd')
  //     }
  //     const parentElement = currentElement.parentElement;

  //     // Count children
  //     if (parentElement.childElementCount > 1) {
  //         // Get children of parent element
  //         const parentsChildren = [...parentElement.children];
  //         // Count current tag 
  //         let tag = [];
  //         parentsChildren.forEach(child => {
  //             if (child.tagName.toLowerCase() === tagName) tag.push(child) // Append to tag
  //         })

  //         // Is only of type
  //         if (tag.length === 1) {
  //             // Append tag to selector
  //             selector = `/${tagName}${selector}`;
  //         } else {
  //             // Get position of current element in tag
  //             const position = tag.indexOf(currentElement) + 1;
  //             // Append tag to selector
  //             selector = `/${tagName}[${position}]${selector}`;
  //         }

  //     } else {
  //         //* Current element has no siblings
  //         // Append tag to selector
  //         selector = `/${tagName}${selector}`;
  //     }

  //     // Set parent element to current element
  //     currentElement = parentElement;
  //     // Is root  
  //     foundRoot = parentElement.tagName.toLowerCase() === 'html';
  //     // Finish selector if found root element
  //     if(foundRoot) selector = `/html${selector}`;
  // }
  // while (foundRoot === false);

  // // Return selector
  // return selector;
}

export function findBy(elements: HTMLElement[], selector: string) {
  const el = document.createElement("div");
  el.append(...elements);
  const result = el.querySelector(selector);
  return result;
}