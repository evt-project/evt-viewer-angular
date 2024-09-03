import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnnotationTextType, AnnotatorColors, AppConfig } from 'src/app/app.config';
import { AnnotatorService } from 'src/app/services/annotator/annotator.service';

interface TextAnnotation {
  options: {
    position: AnnotatorPosition;
    highlightColors: AnnotatorColors;
    showAdder: Boolean;
    updateMode: Boolean;
  }
  values: {
    range: Range;
    type: AnnotationTextType;
    selectedText: string;
  }
}
interface AnnotatorPosition {
  x: number;
  y: number;
}
@Component({
  selector: 'evt-text-annotator',
  templateUrl: './text-annotator.component.html',
  styleUrls: ['./text-annotator.component.scss'],
})
export class TextAnnotatorComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];
  public annotator: TextAnnotation = {
    options: {
      position: { x: 0, y: 0 },
      highlightColors: AppConfig.evtSettings.edition.annotatorColors,
      showAdder: false,
      updateMode: true,
    },
    values: {
      range: null,
      type: null,
      selectedText: '',
    },
  }

  constructor(
    private annotatorService: AnnotatorService,
  ) {
    const { values } = this.annotator;

    this.subscriptions.push(this.annotatorService.textSelection$
      .subscribe((selection) => {
        values.selectedText = selection.toString();
        if (/\S/.test(values.selectedText)) {
          this.openAdder(selection);
        } else {
          this.closeAdder();
        }
      }));
  }

  openAdder(selection: Selection) {
    const { options, values } = this.annotator;
    values.range = selection.getRangeAt(0);
    options.showAdder = true
    const rect = values.range.getBoundingClientRect();
    options.position = { y: rect.bottom, x: rect.left };
  }

  closeAdder() {
    const { options, values } = this.annotator;
    options.showAdder = false;
    values.type = null;
  }

  openCreation(choice: string) {
    const { options, values } = this.annotator;
    values.type = choice as AnnotationTextType;
    options.showAdder = choice !== 'annotate';
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
