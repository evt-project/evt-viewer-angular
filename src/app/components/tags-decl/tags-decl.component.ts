import { Component, Input } from '@angular/core';
import { TagsDecl } from '../../models/evt-models';
import { register } from '../../services/component-register.service';

@Component({
  selector: 'evt-tags-decl',
  templateUrl: './tags-decl.component.html',
  styleUrls: ['./tags-decl.component.scss'],
})
@register(TagsDecl)
export class TagsDeclComponent {
  @Input() data: TagsDecl;
}
