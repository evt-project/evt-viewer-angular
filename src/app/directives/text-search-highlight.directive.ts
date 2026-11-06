import { Directive, ElementRef, EventEmitter, Input, NgZone, OnDestroy, Output } from '@angular/core';
import { findTextRanges } from '../utils/text-search-utils';

export interface TextSearchFocus {
  pageId: string;
  occurrenceId: number;
}

// Highlights are shared by all the text panels, each panel adds and removes only its own ranges
const MATCH_HIGHLIGHT = 'evt-search-match';
const CURRENT_HIGHLIGHT = 'evt-search-current';

const QUERY_DEBOUNCE = 150;
const MUTATIONS_DEBOUNCE = 100;
const FOCUS_RETRY = 200;
const FOCUS_TIMEOUT = 2000;

// The set-like methods of Highlight and HighlightRegistry are declared in lib.dom.iterable, not included in tsconfig
type RangesHighlight = Highlight & Set<AbstractRange>;

function getHighlight(name: string, priority: number): RangesHighlight | undefined {
  if (typeof CSS === 'undefined' || !CSS.highlights) {
    return undefined;
  }
  const registry = CSS.highlights as unknown as Map<string, RangesHighlight>;
  let highlight = registry.get(name);
  if (!highlight) {
    highlight = new Highlight() as RangesHighlight;
    highlight.priority = priority;
    registry.set(name, highlight);
  }

  return highlight;
}

@Directive({
  selector: '[evtTextSearchHighlight]',
})
export class TextSearchHighlightDirective implements OnDestroy {
  @Input('evtTextSearchHighlight') set regExp(regExp: RegExp) {
    if (regExp?.toString() === this.searchRegExp?.toString()) {
      return;
    }
    this.searchRegExp = regExp;
    this.setCurrent(undefined);
    this.toggleObserver(!!regExp);
    this.scheduleRefresh(QUERY_DEBOUNCE);
  }

  @Input() set textSearchFocus(focus: TextSearchFocus) {
    if (focus) {
      this.pendingFocus = { ...focus, requestedAt: Date.now() };
      this.scheduleRefresh(0);
    }
  }

  /** Number of occurrences highlighted */
  @Output() textSearchMatchesChange = new EventEmitter<number>();

  private searchRegExp: RegExp;
  private ranges: Range[] = [];
  private current: Range;
  private pendingFocus: TextSearchFocus & { requestedAt: number };
  private observer: MutationObserver;
  private refreshTimer: ReturnType<typeof setTimeout>;

  constructor(
    private el: ElementRef<HTMLElement>,
    private zone: NgZone,
  ) {
  }

  private toggleObserver(enabled: boolean) {
    if (enabled && !this.observer) {
      this.zone.runOutsideAngular(() => {
        this.observer = new MutationObserver(() => this.scheduleRefresh(MUTATIONS_DEBOUNCE));
        this.observer.observe(this.el.nativeElement, { childList: true, subtree: true, characterData: true });
      });
    } else if (!enabled && this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }

  private scheduleRefresh(delay: number) {
    clearTimeout(this.refreshTimer);
    this.zone.runOutsideAngular(() => {
      this.refreshTimer = setTimeout(() => this.refresh(), delay);
    });
  }

  private refresh() {
    const previousCount = this.ranges.length;
    this.removeHighlights();
    this.ranges = findTextRanges(this.el.nativeElement, this.searchRegExp);
    const matchHighlight = getHighlight(MATCH_HIGHLIGHT, 0);
    this.ranges.forEach((range) => matchHighlight?.add(range));
    // The current occurrence is kept only if its text has not been rendered again
    this.setCurrent(this.ranges.find((range) => range.startContainer === this.current?.startContainer
      && range.startOffset === this.current?.startOffset));
    this.applyPendingFocus();
    if (this.ranges.length !== previousCount) {
      this.zone.run(() => this.textSearchMatchesChange.emit(this.ranges.length));
    }
  }

  private applyPendingFocus() {
    const focus = this.pendingFocus;
    if (!focus || !this.searchRegExp) {
      return;
    }
    const pageEl = this.el.nativeElement.querySelector(`evt-page[data-id="${CSS.escape(focus.pageId)}"]`);
    const pageRanges = pageEl ? this.ranges.filter((range) => pageEl.contains(range.startContainer)) : [];
    // The page could be still rendering: if the occurrence is not there yet, try again later
    if (pageRanges.length <= focus.occurrenceId && Date.now() - focus.requestedAt < FOCUS_TIMEOUT) {
      this.scheduleRefresh(FOCUS_RETRY);

      return;
    }
    this.pendingFocus = undefined;
    const range = pageRanges[Math.min(focus.occurrenceId, pageRanges.length - 1)];
    if (range) {
      this.setCurrent(range);
      range.startContainer.parentElement?.scrollIntoView({ block: 'center' });
    }
  }

  private setCurrent(range: Range) {
    const currentHighlight = getHighlight(CURRENT_HIGHLIGHT, 1);
    if (this.current) {
      currentHighlight?.delete(this.current);
    }
    this.current = range;
    if (range) {
      currentHighlight?.add(range);
    }
  }

  private removeHighlights() {
    const matchHighlight = getHighlight(MATCH_HIGHLIGHT, 0);
    const currentHighlight = getHighlight(CURRENT_HIGHLIGHT, 1);
    this.ranges.forEach((range) => matchHighlight?.delete(range));
    if (this.current) {
      currentHighlight?.delete(this.current);
    }
  }

  ngOnDestroy() {
    clearTimeout(this.refreshTimer);
    this.toggleObserver(false);
    this.removeHighlights();
  }
}
