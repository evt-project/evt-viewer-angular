import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: 'img' // eslint-disable-line
})
export class HandleImgErrorDirective {
  @Input() placeholder: string | undefined;

  placeholderSet = false;

  constructor(
    private elRef: ElementRef,
  ) {
    this.elRef.nativeElement.addEventListener('error', (e: ErrorEvent) => {
      if (this.placeholder) {
        if (!this.placeholderSet) {
          const imgEl = e.target as HTMLImageElement;
          imgEl.src = this.placeholder;
        }
        this.placeholderSet = true;
      }
    });
  }

}
