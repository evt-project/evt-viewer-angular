import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { PageData } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { GenericElementData } from 'src/app/models/parsed-elements';

@Component({
  selector: 'evt-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
@register
export class PageComponent implements OnChanges {
  @Input() data: PageData;
  public contents: GenericElementData[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.data && changes.data.currentValue !== changes.data.previousValue) {
      setTimeout(() => this.contents = [...this.data.parsedContent]);
    }
  }
}
