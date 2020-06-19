import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Attributes } from '../models/evt-models';

@Directive({
  selector: '[evtHtmlAttributes]',
})
export class HtmlAttributesDirective implements OnInit {
  @Input('evtHtmlAttributes') attributes: Attributes;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit() {
    Object.keys(this.attributes).forEach(key => {
      this.renderer.setAttribute(this.el.nativeElement, `data-${key}`, this.attributes[key]);
    });
  }
}
