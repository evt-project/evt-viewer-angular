import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { EditionLevel } from '../../app.config';
import { Page } from '../../models/evt-models';
import { EntitiesSelectItem } from '../entities-select/entities-select.component';

@Component({
  selector: 'evt-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent {
  @Input() itemsToHighlight: EntitiesSelectItem[];
  @Input() editionLevel: EditionLevel;
  @Input() textFlow: boolean;

  private d: Page;
  @Input() set data(v: Page) {
    this.d = v;
    this.pageDataChange.next(this.d);
  }
  get data() { return this.d; }
  pageDataChange = new BehaviorSubject<Page>(undefined);

  busy = of<boolean>(false); // TODO: manage loading
}
