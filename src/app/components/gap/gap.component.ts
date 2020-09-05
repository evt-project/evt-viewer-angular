import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { Gap } from 'src/app/models/evt-models';
import { register } from 'src/app/services/component-register.service';

@Component({
  selector: 'evt-gap',
  templateUrl: './gap.component.html',
  styleUrls: ['./gap.component.scss'],
})
@register(Gap)
export class GapComponent {
  @Input() data: Gap;

  get content() {
    if (!!this.data.unit && !!this.data.quantity) {
      switch (this.data.unit) {
        case 'char':
          return `[${'.'.repeat(this.data.quantity)}]`;
        case 'line':
          return '<span class="line-gap"></span>'.repeat(this.data.quantity);
        case 'word':
          return `[${'... '.repeat(this.data.quantity).slice(0, -1)}]`;
        default:
          return '[***]';
      }
    } else if (this.data.extent) {
      return `[${this.data.extent}]`;
    }

    return '[***]';
  }

  get gapDescription$() {
    return this.translateService.get([this.data.unit, `${this.data.unit}s`, 'missingS', 'missingP', this.data.extent, this.data.reason])
      .pipe(
        map((translations) => {
          let desc = '';
          if (!!this.data.unit || !!this.data.quantity) {
            const unit = this.data.quantity > 1 ? translations[`${this.data.unit}s`] : translations[this.data.unit];
            const missing = this.data.quantity > 1 ? translations.missingP : translations.missingS;
            desc = this.data.quantity ? `${this.data.quantity} ${unit} ${missing}` : `${unit}`;
          } else if (this.data.extent) {
            desc = translations[this.data.extent];
          }
          desc += (this.data.reason ? ` (${translations[this.data.reason]})` : '').trim();

          return translations[this.data.extent] === desc ? '' : desc;
        }),
      );
  }

  constructor(
    private translateService: TranslateService,
  ) {
  }
}
