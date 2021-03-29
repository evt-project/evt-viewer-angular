import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnnotatorService {
  public textSelection$ = new Subject<Selection>();

  selectedText() {
    this.textSelection$.next(window.getSelection());
  }
}
