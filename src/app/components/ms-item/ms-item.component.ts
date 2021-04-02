import { Component, Input } from '@angular/core';
import { MsItem, Text } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-ms-item',
  templateUrl: './ms-item.component.html',
  styleUrls: ['./ms-item.component.scss'],
})

@register(MsItem)
export class MsItemComponent {
  @Input() data: MsItem;
  @Input() nested1: boolean;
  @Input() nested2: boolean;

  get notEmptyElementDt() {
    const newDocTitle = this.data.docTitle.filter((el: Text & MsItem) => el.text?.trim() || el.content?.length > 0);
    newDocTitle.map((item: Text) => { item.text = item.text?.trim(); })

    return newDocTitle;
  }

  get notEmptyElementA() {
    const newAuthor = this.data.author.filter((el: Text & MsItem) => el.text?.trim() || el.content?.length > 0);
    newAuthor.map((item: Text) => { item.text = item.text?.trim(); })

    return newAuthor;
  }

  get notEmptyElementDa() {
    const newDocAuthor = this.data.docAuthor.filter((el: Text & MsItem) => el.text?.trim() || el.content?.length > 0);
    newDocAuthor.map((item: Text) => { item.text = item.text?.trim(); })

    return newDocAuthor;
  }
}
