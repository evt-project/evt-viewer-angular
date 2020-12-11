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

  // tslint:disable-next-line: variable-name
  private _oldStyle: {
    // tslint:disable-next-line: no-any
    [cssProperty: string]: any;
  };

  constructor(
    private editorialConventionsService: EditorialConventionsService,
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit() {
    this._setLayout();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.data.isFirstChange() && changes.data.previousValue !== changes.data.currentValue) {
      this._setLayout();
    }
  }

  private _setLayout() {
    const layouts = this.editorialConventionsService.getLayouts(this.data.name, this.data.attributes, this.data.defaultsKey);
    this._cleanPreviousLayout();
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
          this._oldStyle = editionLayout.style;
        }
      }
    }
  }

  private _cleanPreviousLayout() {
    const preEl = this.el.nativeElement.querySelector('.pre');
    if (preEl) { preEl.remove(); }

    const postEl = this.el.nativeElement.querySelector('.post');
    if (postEl) { postEl.remove(); }

    if (this._oldStyle) {
      Object.keys(this._oldStyle).forEach(key => this.renderer.setStyle(this.el.nativeElement, key, ''));
      this._oldStyle = undefined;
    }
  }
}
