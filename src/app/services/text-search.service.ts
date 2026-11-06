import { Injectable } from '@angular/core';
import { EditionLevelType } from '../app.config';
import { Page } from '../models/evt-models';
import { createSearchRegExp, findMatches, FoldedText, foldText, getXMLDisplayedText } from '../utils/text-search-utils';

export interface TextSearchResult {
  page: Page;
  occurrence: number;
  before: string;
  match: string;
  after: string;
}

export interface TextSearchResults {
  query: string;
  isRegExp: boolean;
  items: TextSearchResult[];
  total: number;
}

interface PageText {
  source: string;
  folded: FoldedText;
}

const SNIPPET_CONTEXT = 50;
const MAX_RESULTS = 500;

@Injectable({
  providedIn: 'root',
})
export class TextSearchService {
  private readonly pageTexts = new WeakMap<Page, Map<EditionLevelType, PageText>>();

  searchInPages(pages: Page[], query: string, isRegExp: boolean, editionLevel: EditionLevelType): TextSearchResults {
    const regExp = createSearchRegExp(query, isRegExp);
    const results: TextSearchResults = { query, isRegExp, items: [], total: 0 };
    if (!regExp) {
      return results;
    }
    for (const page of pages) {
      const { source, folded } = this.getPageText(page, editionLevel);
      findMatches(folded, regExp).forEach(({ start, end }, occurrence) => {
        results.total++;
        if (results.items.length < MAX_RESULTS) {
          results.items.push({ page, occurrence, ...this.getSnippet(source, start, end) });
        }
      });
    }

    return results;
  }

  private getPageText(page: Page, editionLevel: EditionLevelType): PageText {
    let texts = this.pageTexts.get(page);
    if (!texts) {
      texts = new Map();
      this.pageTexts.set(page, texts);
    }
    if (!texts.has(editionLevel)) {
      const source = getXMLDisplayedText(page.originalContent ?? [], editionLevel);
      texts.set(editionLevel, { source, folded: foldText(source) });
    }

    return texts.get(editionLevel);
  }

  private getSnippet(source: string, start: number, end: number) {
    // XML indentation can be long: whitespace is collapsed before taking the context around the match
    const collapse = (s: string) => s.replace(/\s+/g, ' ');
    const sourceBefore = collapse(source.slice(Math.max(0, start - SNIPPET_CONTEXT * 10), start)).trimStart();
    const sourceAfter = collapse(source.slice(end, end + SNIPPET_CONTEXT * 10)).trimEnd();
    let before = sourceBefore.slice(-SNIPPET_CONTEXT);
    let after = sourceAfter.slice(0, SNIPPET_CONTEXT);
    // Truncated words at the edges of the snippet are removed
    if (before.length < sourceBefore.length || start > SNIPPET_CONTEXT * 10) {
      before = `… ${before.replace(/^\S*\s/, '')}`;
    }
    if (after.length < sourceAfter.length || end + SNIPPET_CONTEXT * 10 < source.length) {
      after = `${after.replace(/\s\S*$/, '')} …`;
    }

    return { before, match: collapse(source.slice(start, end)), after };
  }
}
