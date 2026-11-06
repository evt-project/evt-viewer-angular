import { EditionLevelType } from '../app.config';


export interface FoldedText {
  text: string;
  starts: number[]; // offset in the source string of each character of text
  ends: number[];
}

const DIACRITICS = /\p{M}/gu;
const WHITESPACE = /\s/;

function foldChar(ch: string): string {
  if (ch.length === 1 && ch.charCodeAt(0) < 128) {
    return ch.toLowerCase();
  }

  return ch.normalize('NFD').replace(DIACRITICS, '').toLowerCase();
}

export function foldText(source: string): FoldedText {
  const chars: string[] = [];
  const starts: number[] = [];
  const ends: number[] = [];
  let lastWasSpace = true; // leading whitespace is dropped
  let offset = 0;
  for (const ch of source) {
    const end = offset + ch.length;
    if (WHITESPACE.test(ch)) {
      if (!lastWasSpace) {
        chars.push(' ');
        starts.push(offset);
        ends.push(end);
      }
      lastWasSpace = true;
    } else {
      const folded = foldChar(ch);
      for (let i = 0; i < folded.length; i++) {
        chars.push(folded[i]);
        starts.push(offset);
        ends.push(end);
      }
      lastWasSpace = lastWasSpace && !folded;
    }
    offset = end;
  }

  return { text: chars.join(''), starts, ends };
}

export interface TextMatch {
  start: number;
  end: number;
}

/** Throws a SyntaxError if isRegExp and the query is not a valid regular expression */
export function createSearchRegExp(query: string, isRegExp: boolean): RegExp | undefined {
  if (!isRegExp) {
    const needle = foldText(query ?? '').text.trim();

    return needle ? new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g') : undefined;
  }
  // Only diacritics are removed from the pattern, lowercasing it would change escapes like \S or \W
  const pattern = (query ?? '').normalize('NFD').replace(DIACRITICS, '');

  return pattern ? new RegExp(pattern, 'giu') : undefined;
}

/** Source offsets of the non-empty matches of regExp in the folded text */
export function findMatches({ text, starts, ends }: FoldedText, regExp: RegExp): TextMatch[] {
  const matches: TextMatch[] = [];
  const re = new RegExp(regExp.source, regExp.flags.includes('g') ? regExp.flags : `${regExp.flags}g`);
  for (let match = re.exec(text); match; match = re.exec(text)) {
    if (match[0]) {
      matches.push({ start: starts[match.index], end: ends[match.index + match[0].length - 1] });
    } else {
      re.lastIndex++;
    }
  }

  return matches;
}

// XML elements whose text is not shown in the text flow
const XML_SKIPPED = ['note', 'rdg', 'witDetail', 'teiHeader', 'facsimile'];
// XML elements that start a new line or block, hence separate words
const XML_SEPARATORS = ['lb', 'l', 'lg', 'p', 'ab', 'head', 'div', 'pb', 'cb'];
const CHOICE_ORIGINAL = ['orig', 'sic', 'abbr'];
const CHOICE_NORMALIZED = ['reg', 'corr', 'expan'];

/**
 * Text of the XML nodes of a page as it is displayed in the given edition level
 * (see ChoiceComponent for which alternative of a <choice> is shown)
 */
export function getXMLDisplayedText(nodes: Node[], editionLevel: EditionLevelType): string {
  const isOriginal = editionLevel === 'diplomatic' || editionLevel === 'changesView';
  const hiddenInChoice = isOriginal ? CHOICE_NORMALIZED : CHOICE_ORIGINAL;
  const parts: string[] = [];
  const visit = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      parts.push(node.nodeValue);

      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }
    const el = node as Element;
    if (XML_SKIPPED.includes(el.localName)) {
      return;
    }
    if (el.parentElement?.localName === 'choice' && hiddenInChoice.includes(el.localName)) {
      return;
    }
    const isSeparator = XML_SEPARATORS.includes(el.localName);
    if (isSeparator) {
      parts.push(' ');
    }
    el.childNodes.forEach(visit);
    if (isSeparator) {
      parts.push(' ');
    }
  };
  nodes.forEach(visit);

  return parts.join('');
}

const DOM_SKIPPED_SELECTOR = '.lineN, button, .evt-exponent, evt-apparatus-entry-detail, ngx-spinner, script, style';


export function findTextRanges(root: HTMLElement, regExp: RegExp): Range[] {
  if (!regExp) {
    return [];
  }
  const nodes: Text[] = [];
  const nodeStarts: number[] = [];
  const parts: string[] = [];
  let length = 0;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return NodeFilter.FILTER_ACCEPT;
      }
      const el = node as HTMLElement;
      if (el.matches(DOM_SKIPPED_SELECTOR) || getComputedStyle(el).display === 'none') {
        return NodeFilter.FILTER_REJECT;
      }

      // <br> is accepted to separate the words of two lines, other elements are only traversed
      return el.localName === 'br' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.nodeType === Node.TEXT_NODE ? node.nodeValue : ' ';
    if (node.nodeType === Node.TEXT_NODE) {
      nodes.push(node as Text);
      nodeStarts.push(length);
    }
    parts.push(text);
    length += text.length;
  }

  const folded = foldText(parts.join(''));
  // Index of the text node containing the character
  const nodeIndexAt = (offset: number) => {
    let lo = 0;
    let hi = nodeStarts.length - 1;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (nodeStarts[mid] <= offset) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }

    return lo;
  };

  return findMatches(folded, regExp).map(({ start, end }) => {
    const startNode = nodeIndexAt(start);
    const endNode = nodeIndexAt(end - 1);
    const range = document.createRange();
    range.setStart(nodes[startNode], start - nodeStarts[startNode]);
    range.setEnd(nodes[endNode], Math.min(end - nodeStarts[endNode], nodes[endNode].length));

    return range;
  });
}
