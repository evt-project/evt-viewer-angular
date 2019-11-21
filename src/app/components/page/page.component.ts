import { Component, Input, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { PageData } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { Subscription } from 'rxjs';
import { GenericParserService } from '../../services/xml-parsers/generic-parser.service';
import { distinctUntilChanged, delay } from 'rxjs/operators';

@Component({
  selector: 'evt-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
@register
export class PageComponent implements OnDestroy, OnChanges {
  @Input() data: PageData;
  public contents: ChildNode[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private genericParser: GenericParserService
  ) {
    this.subscriptions.push(
      this.genericParser.isBusy
        .pipe(
          delay(0),
          distinctUntilChanged(),
        )
        .subscribe(isBusy => {
          if (!isBusy) {
            this.spinner.hide('pageSpinner');
          }
        })
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.data && changes.data.currentValue !== changes.data.previousValue) {
      if (this.data.content.length) {
        this.spinner.show('pageSpinner');
        this.genericParser.addTask.next(this.data.content.length);
      }
      setTimeout(() => this.contents = [...this.data.content]);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
