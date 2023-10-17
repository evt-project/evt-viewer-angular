import { Directive, ElementRef, Input } from '@angular/core';
import { HighlightData } from '../models/evt-models';

@Directive({
  selector: '[evtHighlight]',
})
export class HighlightDirective {
  @Input('evtHighlight') set highlightData(hd: HighlightData) {
    this.highlight(hd);
  }

  constructor(
    private el: ElementRef,
  ) {
  }

  private highlight(highlightData: HighlightData) {
    if (highlightData.highlight) {
      this.el.nativeElement.classList.add('highlight');
    } else {
      this.el.nativeElement.classList.remove('highlight');
    }
    this.el.nativeElement.style.backgroundColor = highlightData && highlightData.highlight ? highlightData.highlightColor : '';
  }
}
