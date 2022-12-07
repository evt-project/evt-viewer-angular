import { HostListener } from '@angular/core';
import { Directive } from '@angular/core';
import { AnnotatorService } from '../services/annotator/annotator.service';

@Directive({
  selector: '[evtAnnotator]',
})
export class AnnotatorDirective {

  constructor(
    public annotator: AnnotatorService,
  ) { }

  @HostListener('mouseup')
  onMouseup() {
    this.annotator.selectedText();
  }

}
