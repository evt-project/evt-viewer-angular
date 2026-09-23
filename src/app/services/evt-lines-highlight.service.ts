import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, map } from 'rxjs';
import { EVTStatusService } from './evt-status.service';
import { Lb, Paragraph, Verse, Word } from '../models/evt-models';

@Injectable({ providedIn: 'root' })
export class EvtLinesHighlightService {
  private parsedContent: any;
  private lastSelectedId: string = null;
  private lastHoveredId: string = null;

  constructor(private evtStatusService: EVTStatusService) {
    this.evtStatusService.currentPage$.subscribe((page) => {
      this.parsedContent = page?.parsedContent;

      this.lastSelectedId = null;
      this.lastHoveredId = null;
      this.clearHighlightText();

      this._selected$.next(null);
      this._hovered$.next(null);

      if (page) {
        setTimeout(() => {
          page.parsedContent?.forEach((pc) => {
            if (pc) this.assignLbId(pc, false);
          });
        }, 0);
      }
    });

    combineLatest([
      this._hovered$,
      this._selected$,
      this.syncTextImage$
    ])
      .pipe(
        filter(([_, __, isSync]) => isSync),
        distinctUntilChanged(
          ([h1, s1], [h2, s2]) =>
            h1?.corresp === h2?.corresp &&
            s1?.corresp === s2?.corresp
        ),
      )
      .subscribe(([hovered, selected]) => {
        const newSelected = selected?.corresp ?? null;
        const newHovered = hovered?.corresp ?? null;

        // Remove old selected
        if (this.lastSelectedId && this.lastSelectedId !== newSelected) {
          this.updateHighlight(this.lastSelectedId, false, true);
        }

        // Remove old hover
        if (this.lastHoveredId && this.lastHoveredId !== newHovered) {
          this.updateHighlight(this.lastHoveredId, false, false);
        }

        // Apply selected
        if (newSelected) {
          this.updateHighlight(newSelected, true, true);
        }

        // Apply hover
        if (newHovered && newHovered !== newSelected) {
          this.updateHighlight(newHovered, true, false);
        }

        this.lastSelectedId = newSelected;
        this.lastHoveredId = newHovered;
      });
  }

  private _hovered$ = new BehaviorSubject<{ id: string; corresp: string }>(null);
  private _selected$ = new BehaviorSubject<{ id: string; corresp: string }>(null);

  syncTextImage$ = new BehaviorSubject<boolean>(false);

  highlightState$ = combineLatest([
    this._hovered$,
    this._selected$,
    this.syncTextImage$
  ]).pipe(
    filter(([_, __, isSync]) => isSync),
    map(([hovered, selected]) => ({
      hovered,
      selected
    })),
    distinctUntilChanged(
      (a, b) =>
        a.hovered?.corresp === b.hovered?.corresp &&
        a.selected?.corresp === b.selected?.corresp
    )
  );

  setHovered(v: { id: string; corresp: string } | null) {
    this._hovered$.next(v);
  }

  setSelected(v: { id: string; corresp: string } | null) {
    this._selected$.next(v);
  }

  clearHighlight() {
    this._hovered$.next(null);
    this._selected$.next(null);
  }


  private addClass(pc: any, cls: string) {
    if (!pc.class) pc.class = '';
    const classes = pc.class.split(' ').filter(Boolean);
    if (!classes.includes(cls)) {
      classes.push(cls);
      pc.class = classes.join(' ');
    }
  }

  private removeClass(pc: any, cls: string) {
    if (!pc.class) return;
    pc.class = pc.class
      .split(' ')
      .filter(c => c && c !== cls)
      .join(' ');
  }

  private updateHighlight(id: string, add: boolean, isSelected: boolean) {
    if (!this.parsedContent) return;

    for (const pc of this.parsedContent) {
      this.recursiveUpdate(pc, id, add, isSelected);
    }
  }

  private recursiveUpdate(pc: any, id: string, add: boolean, isSelected: boolean): void {
    if (
      pc &&
      pc.type.name !== Verse.name &&
      pc.type.name !== Paragraph.name &&
      pc.type.name !== Word.name
    ) {
      const match = pc.correspId === id;

      if (match) {
        if (add) {
          this.addClass(pc, 'highlightverse');
          if (isSelected) this.addClass(pc, 'selected');
        } else {
          this.removeClass(pc, 'highlightverse');
          this.removeClass(pc, 'selected');
        }
      }
    }

    if (pc?.content) {
      for (const insidePc of pc.content) {
        this.recursiveUpdate(insidePc, id, add, isSelected);
      }
    }
  }

  private clearHighlightText(): void {
    if (!this.parsedContent) return;

    for (const pc of this.parsedContent) {
      this.recursiveClear(pc);
    }
  }

  private recursiveClear(pc: any): void {
    if (pc?.class) {
      pc.class = pc.class
        .split(' ')
        .filter(c => c !== 'highlightverse' && c !== 'selected')
        .join(' ');
    }

    if (pc?.content) {
      for (const insidePc of pc.content) {
        this.recursiveClear(insidePc);
      }
    }
  }

  private tempLbId = '';
  private tempCorrespId = '';

  private assignLbId(startingContent: any, ignoreFindLbElement: boolean): void {
    if (startingContent.type.name === Verse.name && startingContent.attributes['facs']) {
      const facsId = startingContent.attributes['facs'].replace('#', '');
      const id = startingContent.attributes['id'];

      this.tempLbId = facsId;
      this.tempCorrespId = id;

      startingContent.lbId = this.tempLbId;
      startingContent.correspId = this.tempCorrespId;

      for (const insideContent of startingContent.content) {
        this.assignLbId(insideContent, true);
      }

      this.tempLbId = '';
      this.tempCorrespId = '';
      return;
    }

    if (startingContent.type.name === Lb.name && !ignoreFindLbElement) {
      this.tempLbId = startingContent.facs?.replace('#', '');
      this.tempCorrespId = startingContent.id?.replace('#', '');
      return;
    }

    startingContent.lbId = this.tempLbId;
    startingContent.correspId = this.tempCorrespId;

    if (startingContent.content !== undefined) {
      for (const insideContent of startingContent.content) {
        this.assignLbId(insideContent, ignoreFindLbElement);
      }
    }
  }
}