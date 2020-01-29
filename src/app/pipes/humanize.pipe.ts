import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'humanize' })
export class HumanizePipe implements PipeTransform {

  transform(value: string) {
    if (value === '') {
      return value;
    }

    value = value.replace(/([^A-Z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][^A-Z])/g, '$1 $2');

    return value;
  }
}
