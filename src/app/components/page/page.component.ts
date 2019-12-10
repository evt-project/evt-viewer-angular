import { Component, Input } from '@angular/core';
import { Subject, of } from 'rxjs';
import { scan, map } from 'rxjs/operators';
import { PageData } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
@register
export class PageComponent {

  private d: PageData;
  @Input() set data(v: PageData) {
    this.d = v;
    this.pageDataChange.next(this.d);
  }
  get data() { return this.d; }
  pageDataChange = new Subject<PageData>();

  busy = of<boolean>(false); // TODO: manage loading
}
