import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
})
@Injectable()
export class FilterPipe implements PipeTransform {
    transform<T>(items: T[], field: string, value: string): T[] {
        if (!items) { return []; }
        if (!value || value.length === 0) { return items; }
        const results = items.filter(it => it[field] && value && it[field].toLowerCase().indexOf(value.toLocaleLowerCase()) !== -1);

        return results.length > 0 ? results : [undefined];
    }
}
