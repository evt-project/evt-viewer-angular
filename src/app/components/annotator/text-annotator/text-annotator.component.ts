import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnnotatorColors, AppConfig } from 'src/app/app.config';
import { AnnotatorService } from 'src/app/services/annotator/annotator.service';

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
  public highlightColors: AnnotatorColors = AppConfig.evtSettings.edition.annotatorColors;
  public selectedText: string;
  public showAdder = false;
  public menuPosition: AnnotatorPosition = { x: 0, y: 0 };
  public annoType: string;
  public updateMode = true;

  constructor(
    private annotator: AnnotatorService,
  ) {
    this.subscriptions.push(this.annotator.textSelection$
      .subscribe((selection) => {
        this.selectedText = selection.toString();
        if (/\S/.test(this.selectedText)){
          this.openAdder(selection);
        }else{
          this.closeAdder();
        }
    }));
  }

  openAdder(selection: Selection) {
    this.showAdder = true;
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    this.menuPosition.y = rect.bottom;
    this.menuPosition.x = rect.left;
  }

  closeAdder(){
    this.showAdder = false;
    this.annoType = undefined;
  }

  openCreation(choice: string){
    this.annoType = choice;
    this.showAdder = choice !== 'annotate';
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
