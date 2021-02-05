import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { EditionLevelType } from '../app.config';
import { Attributes, EditorialConventionLayouts } from '../models/evt-models';
import { EditorialConventionDefaults, EditorialConventionsService } from '../services/editorial-conventions.service';

export interface EditorialConventionLayoutData {
  name: string;
  attributes: Attributes;
  editionLevel: EditionLevelType;
  defaultsKey?: EditorialConventionDefaults;
}

@Directive({
  selector: '[evtEditorialConventionLayout]',
})
export class EditorialConventionLayoutDirective implements OnInit, OnChanges {
  @Input('evtEditorialConventionLayout') data: EditorialConventionLayoutData;
  @Input() defaultLayouts: Partial<EditorialConventionLayouts>;

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  private oldStyle: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [cssProperty: string]: any;
  };

  constructor(
    private editorialConventionsService: EditorialConventionsService,
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit() {
    this.setLayout();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.data.isFirstChange() && changes.data.previousValue !== changes.data.currentValue) {
      this.setLayout();
    }
  }

  private setLayout() {
    const layouts = this.editorialConventionsService.getLayouts(this.data.name, this.data.attributes, this.data.defaultsKey);
    this.cleanPreviousLayout();
    if (layouts && this.data.editionLevel) {
      const editionLayout = layouts[this.data.editionLevel];
      if (editionLayout) {
        if (editionLayout.pre) {
          const preEl = document.createElement('span');
          preEl.classList.add('pre');
          preEl.innerHTML = editionLayout.pre;
          this.el.nativeElement.prepend(preEl);
        }

        if (editionLayout.post) {
          const postEl = document.createElement('span');
          postEl.classList.add('post');
          postEl.innerHTML = editionLayout.post;
          this.renderer.appendChild(this.el.nativeElement, postEl);
        }

        if (editionLayout.style) {
          Object.keys(editionLayout.style).forEach(key => this.renderer.setStyle(this.el.nativeElement, key, editionLayout.style[key]));
          this.oldStyle = editionLayout.style;
        }
      }
    }
  }

  private cleanPreviousLayout() {
    const preEl = this.el.nativeElement.querySelector('.pre');
    if (preEl) { preEl.remove(); }

    const postEl = this.el.nativeElement.querySelector('.post');
    if (postEl) { postEl.remove(); }

    if (this.oldStyle) {
      Object.keys(this.oldStyle).forEach(key => this.renderer.setStyle(this.el.nativeElement, key, ''));
      this.oldStyle = undefined;
    }
  }
}
