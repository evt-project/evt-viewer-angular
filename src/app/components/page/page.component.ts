import { Component, Input } from '@angular/core';
import { PageData } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
@register
export class PageComponent {
  @Input() data: PageData;
}
