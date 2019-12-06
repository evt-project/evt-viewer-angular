import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { interval, Subject, from } from 'rxjs';
import { tap, scan, take, takeUntil, withLatestFrom, map } from 'rxjs/operators';
import { PageData } from '../../models/evt-models';
import { GenericElementData } from '../../models/parsed-elements';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
@register
export class PageComponent implements OnChanges {
  @Input() data: PageData;
  public parsedContents: Subject<GenericElementData[]> = new Subject();

  public parsedContents$ = this.parsedContents.pipe(
    scan((x, y) => y ? x.concat(y) : [], []),
  );

  public busy$ = this.parsedContents$.pipe(
    map(contents => contents && this.data && contents.length !== this.data.parsedContent.length),
  );

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.data && changes.data.currentValue !== changes.data.previousValue) {
      this.parsedContents.next(undefined);
      interval(1).pipe(
        take(this.data.parsedContent.length),
      ).subscribe(x => this.parsedContents.next([this.data.parsedContent[x]]));
    }
  }
}
