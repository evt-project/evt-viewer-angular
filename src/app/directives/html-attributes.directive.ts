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
    Object.keys(this.attributes || {}).forEach((key) => {
      const value = this.attributes[key];

      // layout and semantic attributes shouldn't be grouped in the same attribute property, consider changing GenericElement
      if (key === 'style' || key === 'class' || key === 'id') {
        this.renderer.setAttribute(this.el.nativeElement, key, value);
      } else {
        this.renderer.setAttribute(this.el.nativeElement, `data-${key}`, value);
      }
    });
  }

}
