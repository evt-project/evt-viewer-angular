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

  get getDocTitle() {
    return this.data.docTitle.filter((el: Text & MsItem) => el.text?.trim() || el.content?.length > 0)
      .map((item: Text & MsItem) => {
        if (item.text) { item.text = item.text.trim(); }

        return item;
      });
  }

  get getAuthor() {
    return this.data.author.filter((el: Text & MsItem) => el.text?.trim() || el.content?.length > 0)
      .map((item: Text & MsItem) => {
        if (item.text) { item.text = item.text.trim(); }

        return item;
      });
  }

  get getDocAuthor() {
    return this.data.docAuthor.filter((el: Text & MsItem) => el.text?.trim() || el.content?.length > 0)
      .map((item: Text & MsItem) => {
        if (item.text) { item.text = item.text.trim(); }

        return item;
      });
  }
}
